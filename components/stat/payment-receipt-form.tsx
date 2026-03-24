/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { baseUrl } from "@/config/env";
import { showError, showSuccess } from "@/app/utils/message";
import axios from "axios";
import { useCompanyStore } from "@/store/useCompanyStore";

const UploadReceiptForm = ({
  onUploadSuccess,
}: {
  onUploadSuccess: () => void;
}) => {
  const [bankName, setBankName] = useState("");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { company, fetchCompany } = useCompanyStore();

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !company?.id || !bankName || !amount) {
      return showError("Please fill all fields and select a receipt image.");
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("paymentPhoto", file);
    formData.append("bankName", bankName);
    formData.append("amount", amount);
    formData.append("companyId", company.id); // use company id instead of user id

    try {
      const res = await axios.post(`${baseUrl}/payment`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      showSuccess(res.data.message);
      setBankName("");
      setAmount("");
      setFile(null);
      (e.target as HTMLFormElement).reset();
      onUploadSuccess();
    } catch (er: any) {
      showError(
        er.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="bankName">Bank Name</Label>
        <Select onValueChange={setBankName} value={bankName}>
          <SelectTrigger id="bankName">
            <SelectValue placeholder="Select a bank" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CBE Bank">CBE Bank</SelectItem>
            <SelectItem value="Abyssinia Bank">Abyssinia Bank</SelectItem>
            <SelectItem value="Dashen Bank">Dashen Bank</SelectItem>
            <SelectItem value="Hibret Bank">Hibret Bank</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          placeholder="Enter amount paid"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="receipt">Receipt Picture</Label>
        <Input
          id="receipt"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        <UploadCloud className="mr-2 h-4 w-4" />{" "}
        {isSubmitting ? "Uploading..." : "Submit for Approval"}
      </Button>
    </form>
  );
};

export default UploadReceiptForm;
