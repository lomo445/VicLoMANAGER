export function calculateElectricalCost(powerConsumptionW: number, printTimeMinutes: number, costKwh: number) {
  return (powerConsumptionW / 1000) * (printTimeMinutes / 60) * costKwh
}

export function calculateMaterialCost(weightG: number, costPerKg: number) {
  return (weightG / 1000) * costPerKg
}

export function calculateTotalExtrasCost(extras: { unit_cost: number; quantity: number }[]) {
  return extras.reduce((acc, extra) => acc + (extra.unit_cost * extra.quantity), 0)
}

export function calculateExtrasSurcharge(extras: { unit_price: number; quantity: number }[]) {
  return extras.reduce((acc, extra) => acc + (extra.unit_price * extra.quantity), 0)
}

export function calculateTotalProductionCost(
  electricalCost: number,
  materialCost: number,
  extrasCost: number
) {
  return electricalCost + materialCost + extrasCost
}

export function calculateFinalSellingPrice(basePrice: number, extrasSurcharge: number) {
  return basePrice + extrasSurcharge
}

export function calculateOrderMargin(finalPrice: number, totalProductionCost: number) {
  return finalPrice - totalProductionCost
}
