export interface DefaultCategory {
  name: string;
  description: string;
}

export const defaultCategories: DefaultCategory[] = [
  { name: 'Dining', description: 'Restaurant meals and food delivery' },
  { name: 'Groceries', description: 'Supermarket and food shopping' },
  { name: 'Fuel', description: 'Gas station and vehicle fuel' },
  { name: 'School Fees', description: 'Education and tuition expenses' },
  { name: 'Transportation', description: 'Public transport and taxi' },
  { name: 'Utilities', description: 'Electricity, water, gas bills' },
  { name: 'Healthcare', description: 'Medical and medicine expenses' },
  { name: 'Entertainment', description: 'Movies, games, streaming' },
  { name: 'Shopping', description: 'Clothing and general purchases' },
  { name: 'Insurance', description: 'Insurance premiums' },
  { name: 'Rent', description: 'Monthly rent payments' },
  { name: 'Phone', description: 'Mobile and internet bills' },
  { name: 'Gym', description: 'Fitness and sports activities' },
  { name: 'Travel', description: 'Vacation and travel expenses' },
  { name: 'Personal Care', description: 'Haircuts and personal hygiene' },
  { name: 'Subscriptions', description: 'Monthly service subscriptions' },
];
