import mongoose from "mongoose";

const PositionSchema = new mongoose.Schema({
  Symbol: String,
  PriceEntry: String,
  StopLoss: String,
  TakeProfit: String,
  TakeProfit2: String,
  TradeDirection: String,
  PositionType: String,
  ActiveAllocation: String,
  TradeDate: String,
  State: Boolean,
});

export default mongoose.model("Position", PositionSchema);
