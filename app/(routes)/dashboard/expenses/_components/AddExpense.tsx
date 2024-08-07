import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import moment from "moment";
import { useState } from "react";
import { toast } from "sonner";

export default function AddExpense({
  budgetId,
  refreshData,
}: {
  budgetId: string;
  refreshData: () => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const addNewExpense = async () => {
    const result = await db
      .insert(Expenses)
      // @ts-ignore
      .values({
        name: name,
        amount: amount,
        budgetId: budgetId,
        createdAt:moment().format("MM/DD/YY")
      })
      .returning({ insertedId: Budgets.id });

    if (result) {
      refreshData();
      setName("");
      setAmount("");
      toast("New Expense Added!");
    }
  };

  return (
    <div className="border p-5 rounded-lg">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Vegetables"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          placeholder="e.g. 25"
          type="number"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
      </div>
      <Button
        disabled={!(name && amount)}
        onClick={() => addNewExpense()}
        className="mt-3 w-full"
      >
        Add New Expense
      </Button>
    </div>
  );
}
