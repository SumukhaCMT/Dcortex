import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { useSubmitContactForm } from "@workspace/api-client-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  airline: z.string().min(1, "Airline is required"),
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  purpose: z.string().min(1, "Purpose is required"),
});

export function ContactModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const submitContact = useSubmitContactForm();
  const [success, setSuccess] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      airline: "",
      name: "",
      designation: "",
      purpose: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitContact.mutate(
      { data: values },
      {
        onSuccess: () => {
          setSuccess(true);
        },
      }
    );
  }

  const handleClose = () => {
    if (!submitContact.isPending) {
      onClose();
      // Reset after animation completes
      setTimeout(() => {
        setSuccess(false);
        form.reset();
        submitContact.reset();
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Connect with dCortex</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {success ? "We've received your request." : "Fill out the form below and our team will get back to you shortly."}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-primary" />
            </div>
            <h3 className="text-xl font-medium text-foreground">Message Sent</h3>
            <p className="text-muted-foreground">Thank you for reaching out. We will be in touch soon.</p>
            <Button onClick={handleClose} className="mt-4" variant="outline">
              Close
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="bg-background border-border text-foreground" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="airline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Airline / Organization</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Airways" className="bg-background border-border text-foreground" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Designation</FormLabel>
                    <FormControl>
                      <Input placeholder="VP of Operations" className="bg-background border-border text-foreground" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Purpose to connect</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="How can dCortex help your operations?" 
                        className="bg-background border-border text-foreground min-h-[100px] resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {submitContact.isError && (
                <div className="p-3 rounded bg-destructive/10 text-destructive text-sm border border-destructive/20">
                  Failed to send message. Please try again.
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={submitContact.isPending}
                  className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {submitContact.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
