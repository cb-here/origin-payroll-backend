import PaymentBatch from "../models/payment.model.js";
import { successResponse, badRequest } from "../utils/response.js";
import sendEmail from "../utils/sendEmail.js";
import {
  paymentNotificationTemplate,
  paymentNotificationTextTemplate,
} from "../utils/emailTemplates.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all batches for the user
    const batches = await PaymentBatch.find({ userId });

    // Calculate statistics
    let totalPayments = 0;
    let totalVisits = 0;
    let totalPayPeriods = 0;
    const providersSet = new Set();
    const recentBatches = [];
    let totalEmailsSent = 0;

    batches.forEach((batch) => {
      // Calculate total payments from visits
      const batchTotal = batch.visits.reduce(
        (sum, visit) => sum + visit.total,
        0
      );
      totalPayments += batchTotal;

      // Count visits
      totalVisits += batch.totalVisits;

      // Count pay periods
      totalPayPeriods += batch.payPeriods;

      // Track unique providers
      batch.visits.forEach((visit) => {
        providersSet.add(visit.providerEmailId);
      });

      // Count emails sent
      totalEmailsSent += batch.emailsSent.length;

      // Add to recent batches
      recentBatches.push({
        _id: batch._id,
        fileName: batch.fileName,
        totalVisits: batch.totalVisits,
        payPeriods: batch.payPeriods,
        providers: batch.providers,
        createdAt: batch.createdAt,
        emailsSent: batch.emailsSent.length,
      });
    });

    // Sort recent batches by date and limit to 5
    recentBatches.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentFive = recentBatches.slice(0, 5);

    // Get monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = {};
    batches.forEach((batch) => {
      if (new Date(batch.createdAt) >= sixMonthsAgo) {
        const monthYear = new Date(batch.createdAt).toLocaleDateString(
          "en-US",
          { year: "numeric", month: "short" }
        );
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {
            month: monthYear,
            totalAmount: 0,
            visits: 0,
            batches: 0,
          };
        }
        const batchTotal = batch.visits.reduce(
          (sum, visit) => sum + visit.total,
          0
        );
        monthlyData[monthYear].totalAmount += batchTotal;
        monthlyData[monthYear].visits += batch.totalVisits;
        monthlyData[monthYear].batches += 1;
      }
    });

    const monthlyTrend = Object.values(monthlyData);

    return successResponse(res, 200, "Dashboard statistics retrieved successfully", {
      stats: {
        totalPayments,
        totalProviders: providersSet.size,
        totalVisits,
        totalPayPeriods,
        totalBatches: batches.length,
        totalEmailsSent,
      },
      recentBatches: recentFive,
      monthlyTrend,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return badRequest(res, 500, "Failed to fetch dashboard statistics");
  }
};

// Save payment batch after CSV upload
export const savePaymentBatch = async (req, res) => {
  try {
    const { fileName, totalVisits, payPeriods, providers, visits } = req.body;

    // Validate required fields
    if (!fileName || !totalVisits || !payPeriods || !providers || !visits) {
      return badRequest(res, 400, "All fields are required");
    }

    if (!Array.isArray(visits) || visits.length === 0) {
      return badRequest(res, 400, "Visits data is required");
    }

    // Create payment batch
    const paymentBatch = await PaymentBatch.create({
      userId: req.user._id,
      fileName,
      totalVisits,
      payPeriods,
      providers,
      visits,
    });

    return successResponse(res, 200, "Payment batch saved successfully", {
      batchId: paymentBatch._id,
      fileName: paymentBatch.fileName,
      totalVisits: paymentBatch.totalVisits,
      payPeriods: paymentBatch.payPeriods,
      providers: paymentBatch.providers,
      createdAt: paymentBatch.createdAt,
    });
  } catch (error) {
    console.error("Error saving payment batch:", error);
    return badRequest(res, 500, "Failed to save payment batch");
  }
};

// Get all payment batches for user
export const getPaymentBatches = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { userId: req.user._id };

    // Add search filter if provided
    if (search) {
      query.fileName = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Calculate pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Get total count for pagination
    const totalCount = await PaymentBatch.countDocuments(query);

    // Get paginated batches
    const batches = await PaymentBatch.find(query)
      .select("-visits") // Exclude visits array for list view
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    return successResponse(res, 200, "Payment batches retrieved successfully", {
      batches,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        totalCount,
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error("Error fetching payment batches:", error);
    return badRequest(res, 500, "Failed to fetch payment batches");
  }
};

// Get specific payment batch by ID with optional filters
export const getPaymentBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, providerEmail } = req.query;

    const batch = await PaymentBatch.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!batch) {
      return badRequest(res, 404, "Payment batch not found");
    }

    // Apply filters to visits if provided
    let filteredVisits = batch.visits;

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredVisits = filteredVisits.filter((visit) => {
        const visitDate = new Date(visit.visitDate);
        return visitDate >= start && visitDate <= end;
      });
    }

    // Filter by provider email
    if (providerEmail) {
      filteredVisits = filteredVisits.filter(
        (visit) => visit.providerEmailId === providerEmail
      );
    }

    // Return batch with filtered visits
    const filteredBatch = {
      ...batch.toObject(),
      visits: filteredVisits,
    };

    return successResponse(res, 200, "Payment batch retrieved successfully", {
      batch: filteredBatch,
    });
  } catch (error) {
    console.error("Error fetching payment batch:", error);
    return badRequest(res, 500, "Failed to fetch payment batch");
  }
};

// Get unique providers from a batch
export const getBatchProviders = async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await PaymentBatch.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!batch) {
      return badRequest(res, 404, "Payment batch not found");
    }

    // Extract unique providers
    const providersMap = new Map();
    batch.visits.forEach((visit) => {
      if (!providersMap.has(visit.providerEmailId)) {
        providersMap.set(visit.providerEmailId, {
          email: visit.providerEmailId,
          firstName: visit.firstName,
          lastName: visit.lastName,
          name: `${visit.firstName} ${visit.lastName}`,
        });
      }
    });

    const providers = Array.from(providersMap.values());

    return successResponse(res, 200, "Providers retrieved successfully", {
      providers,
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return badRequest(res, 500, "Failed to fetch providers");
  }
};

// Delete payment batch
export const deletePaymentBatch = async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await PaymentBatch.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!batch) {
      return badRequest(res, 404, "Payment batch not found");
    }

    return successResponse(res, 200, "Payment batch deleted successfully");
  } catch (error) {
    console.error("Error deleting payment batch:", error);
    return badRequest(res, 500, "Failed to delete payment batch");
  }
};

// Send payment notification emails to selected providers
export const sendPaymentEmails = async (req, res) => {
  try {
    const { providers, batchId, periodStart, periodEnd } = req.body;

    if (!providers || !Array.isArray(providers) || providers.length === 0) {
      return badRequest(res, 400, "Provider data is required");
    }

    if (!batchId || !periodStart || !periodEnd) {
      return badRequest(res, 400, "Batch ID and period dates are required");
    }

    // Find the batch
    const batch = await PaymentBatch.findOne({
      _id: batchId,
      userId: req.user._id,
    });

    if (!batch) {
      return badRequest(res, 404, "Payment batch not found");
    }

    // Check for already sent emails
    const periodStartDate = new Date(periodStart);
    const periodEndDate = new Date(periodEnd);

    const alreadySent = [];
    const toSend = [];

    providers.forEach((provider) => {
      const existingEmail = batch.emailsSent.find(
        (record) =>
          record.providerEmail === provider.email &&
          new Date(record.periodStart).getTime() === periodStartDate.getTime() &&
          new Date(record.periodEnd).getTime() === periodEndDate.getTime()
      );

      if (existingEmail) {
        alreadySent.push({
          email: provider.email,
          status: "already_sent",
          success: false,
          message: `Email already sent on ${new Date(existingEmail.sentAt).toLocaleString()}`,
        });
      } else {
        toSend.push(provider);
      }
    });

    // Send emails to providers who haven't received them yet
    const emailPromises = toSend.map(async (provider) => {
      try {
        // Format date for email
        const formatDate = (date) => {
          return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        };

        // Format visit dates in visits array
        const formattedVisits = provider.visits.map((visit) => ({
          ...visit,
          visitDate: formatDate(visit.visitDate),
        }));

        const emailData = {
          providerName: `${provider.firstName} ${provider.lastName}`,
          periodStart: formatDate(provider.periodStart),
          periodEnd: formatDate(provider.periodEnd),
          visits: formattedVisits,
          totalAmount: provider.totalAmount,
          visitRateTotal: provider.visitRateTotal,
          surchargeTotal: provider.surchargeTotal,
        };

        const htmlContent = paymentNotificationTemplate(emailData);
        const textContent = paymentNotificationTextTemplate(emailData);

        await sendEmail({
          email: provider.email,
          subject: `Payment Notification - ${emailData.periodStart} to ${emailData.periodEnd}`,
          html: htmlContent,
          message: textContent,
        });

        // Record the email send
        batch.emailsSent.push({
          providerEmail: provider.email,
          periodStart: periodStartDate,
          periodEnd: periodEndDate,
          sentAt: new Date(),
        });

        return { email: provider.email, status: "sent", success: true };
      } catch (error) {
        console.error(`Error sending email to ${provider.email}:`, error);
        return {
          email: provider.email,
          status: "failed",
          success: false,
          error: error.message,
        };
      }
    });

    const sendResults = await Promise.all(emailPromises);

    // Save the batch with updated emailsSent records
    if (sendResults.some((r) => r.success)) {
      await batch.save();
    }

    // Combine results
    const allResults = [...alreadySent, ...sendResults];
    const successCount = sendResults.filter((r) => r.success).length;
    const failedCount = sendResults.filter((r) => !r.success).length;
    const alreadySentCount = alreadySent.length;

    let message = "";
    if (alreadySentCount > 0 && successCount > 0) {
      message = `${successCount} email${successCount > 1 ? "s" : ""} sent, ${alreadySentCount} already sent, ${failedCount} failed`;
    } else if (alreadySentCount > 0 && successCount === 0) {
      message = `All ${alreadySentCount} email${alreadySentCount > 1 ? "s were" : " was"} already sent for this date range`;
    } else {
      message = `${successCount} email${successCount > 1 ? "s" : ""} sent, ${failedCount} failed`;
    }

    return successResponse(res, 200, message, {
      totalSent: successCount,
      totalFailed: failedCount,
      totalAlreadySent: alreadySentCount,
      results: allResults,
    });
  } catch (error) {
    console.error("Error sending payment emails:", error);
    return badRequest(res, 500, "Failed to send payment emails");
  }
};
