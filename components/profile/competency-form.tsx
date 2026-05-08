"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";

// Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

// 1. Define Form Schema
const competencySchema = z.object({
  doctorName: z.string().min(2, "Doctor name is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  expirationDate: z.string().min(1, "Expiration date is required"),
  licenseFile: z.instanceof(File).optional(),
});

type CompetencyFormValues = z.infer<typeof competencySchema>;
type Competency = {
  id: string;
  doctorName: string;
  issueDate: string;
  expirationDate: string;
  isActive?: boolean;
  licenseFile?: File | null;
};

const CompetencyView = ({ competencies }: { competencies: Competency[] }) => {
  const [open, setOpen] = useState(false);
  const [selectedCompetency, setSelectedCompetency] = useState<
    Competency | null
  >(null);

  const form = useForm<CompetencyFormValues>({
    resolver: zodResolver(competencySchema),
    defaultValues: {
      doctorName: "",
      issueDate: "",
      expirationDate: "",
      licenseFile: undefined,
    },
  });

  const onSubmit = async (values: CompetencyFormValues) => {
    console.log("Submitting Competency:", values);

    // try {
    //   let response;
    //   if (selectedCompetency) {
    //     // If it's an update, send a PUT request
    //     response = await axios.put(`/api/competency/${selectedCompetency.id}`, {
    //       ...values,
    //     });
    //     showSuccess("Competency updated successfully");
    //   } else {
    //     // If it's a new competency, send a POST request
    //     response = await axios.post("/api/competency", {
    //       ...values,
    //     });
    //     showSuccess("Competency added successfully");
    //   }
    //   // After a successful API call, close the dialog and reset the form
    //   setOpen(false);
    //   form.reset();
    //   setSelectedCompetency(null);
    // } catch (error) {
    //   console.error("Error submitting competency:", error);
    //   showError("Error submitting competency. Please try again later.");
    // }
  };

  const handleEditClick = (competency: Competency) => {
    setSelectedCompetency(competency);
    form.reset({
      doctorName: competency.doctorName,
      issueDate: competency.issueDate,
      expirationDate: competency.expirationDate,
      licenseFile: competency.licenseFile ?? undefined,
    });
    setOpen(true);
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Competency List</CardTitle>
          <CardDescription>Manage doctors and active licenses.</CardDescription>
        </div>

        {/* Global Add Button */}
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 gap-2"
          disabled={true}
          onClick={() => {
            setSelectedCompetency(null);
            form.reset();
            setOpen(true);
          }}
        >
          <Plus size={16} />
          Add Competency
        </Button>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border border-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="p-4 text-left">Doctor</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Expires</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {competencies.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-medium">{c.doctorName}</td>
                  <td className="p-4">
                    <Badge
                      className={c.isActive ? "bg-emerald-500" : "bg-slate-300"}
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-500">
                    {new Date(c.expirationDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={true}
                      onClick={() => handleEditClick(c)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      {/* Shared Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedCompetency ? "Update Competency" : "Add Competency"}
            </DialogTitle>
            <DialogDescription>
              {selectedCompetency
                ? "Edit the doctor's medical competency record."
                : "Add a new doctor's medical competency record."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Doctor Name */}
              <FormField
                control={form.control}
                name="doctorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Gregory House" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expirationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* License Path */}
                <FormField
                  control={form.control}
                  name="licenseFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Document</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {selectedCompetency ? "Update" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CompetencyView;
