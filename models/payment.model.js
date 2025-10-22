import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  providerEmailId: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  visitDate: {
    type: Date,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  visitRate: {
    type: Number,
    required: true,
  },
  surcharge: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
});

const emailSentSchema = new mongoose.Schema({
  providerEmail: {
    type: String,
    required: true,
  },
  periodStart: {
    type: Date,
    required: true,
  },
  periodEnd: {
    type: Date,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

const paymentBatchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "authUser",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    totalVisits: {
      type: Number,
      required: true,
    },
    payPeriods: {
      type: Number,
      required: true,
    },
    providers: {
      type: Number,
      required: true,
    },
    visits: [visitSchema],
    emailsSent: [emailSentSchema],
  },
  {
    timestamps: true,
  }
);

const PaymentBatch = mongoose.model("PaymentBatch", paymentBatchSchema);

export default PaymentBatch;
