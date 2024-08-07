import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import EmojiPicker from "emoji-picker-react"
import { useState } from "react";
import { toast } from "sonner";

interface createBudgetProps {
  refreshData: () => {}; 
}

export default function CreateBudget({refreshData}: createBudgetProps){

  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const {user} = useUser();

  // Creates a new budget
  const onCreateBudget = async () => {
    const result = await db.insert(Budgets)
    // @ts-ignore
    .values({
      name: name,
      amount: amount,
      createdBy: user?.primaryEmailAddress?.emailAddress,
      icon: emojiIcon
    }).returning({insertedId: Budgets.id})

    if (result){
      refreshData()
      toast("New Budget Created")
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="bg-slate-100 p-10 rounded-md
          items-center flex flex-col border-2 border-dashed
          cursor-pointer hover:shadow-md">
            <h2 className="text-3xl">+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Button variant="outline"
                  size="lg"
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >{emojiIcon}</Button>
                <div className="absolute">
                  <EmojiPicker
                  open={openEmojiPicker}
                  onEmojiClick={(e) => {
                    setEmojiIcon(e.emoji)
                    setOpenEmojiPicker(false)
                  }}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Name</h2>
                  <Input placeholder="e.g. Groceries"
                  onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Amount</h2>
                  <Input placeholder="e.g. 500"
                  type="number"
                  onChange={(e) => setAmount(e.target.value)}/>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button 
                disabled={!(name && amount)}
                onClick={() => onCreateBudget()}
                className="mt-5 w-full"
              >Create Budget</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
