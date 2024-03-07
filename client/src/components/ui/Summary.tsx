import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Textarea } from "./textarea"
import { useMutation } from "@tanstack/react-query"
import { updateStorySummary } from "@/api/login"

export function Summary(props: {storyID: string, token: string, summaryOpen: boolean, setSummaryOpen: (i: boolean) => void }) {
  let [sum, setSum] = useState('');

  let mutation = useMutation({
    mutationFn: updateStorySummary
  })

  function handler() {
    if(sum) {
      mutation.mutate({ token: props.token, storyID: props.storyID, summary: sum });
      props.setSummaryOpen(false);
    }
  }

  return (
    <Dialog open={props.summaryOpen} onOpenChange={props.setSummaryOpen}>
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add summary</DialogTitle>
          <DialogDescription>
            Make changes to summary for you story here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4" onKeyDown={e => e.stopPropagation()}>
          <div className="flex-col">
            <Label htmlFor="summary" className="text-right">
              Summary
            </Label>
            <Textarea
              id="summary"
              placeholder="Enter your summary here..."
              className="col-span-3"
              value={sum}
              onChange={e => {
                setSum(e.target.value)
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handler}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
