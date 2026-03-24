/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { MoreHorizontal, Eye } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { postRequest, baseUrl, baseUrlLocation } from "@/app/utils/service";
import { showError, showSuccess } from "@/app/utils/message";

import { useCompanyStore } from "@/store/use-admin-company-store";
import { ICompany } from "@/types/company";
import { useRouter } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api-client";
import { licenseLocation, socketUrl } from "@/config/env";

// --- Helper Component for Status Badges ---
const StatusBadge = ({ status }: { status: ICompany["status"] }) => {
  const variant: "default" | "secondary" | "destructive" =
    status === "ACCEPTED"
      ? "default"
      : status === "REJECTED"
        ? "destructive"
        : "secondary";

  const statusText =
    status === "PENDING"
      ? "Pending"
      : status === "ACCEPTED"
        ? "Approved"
        : status;

  return (
    <Badge
      variant={variant}
      className={status === "ACCEPTED" ? "bg-green-600" : ""}
    >
      {statusText}
    </Badge>
  );
};

const AdminApprovalTable = () => {
  const { clients } = useCompanyStore();
  const router = useRouter();
  const [decisionChange, setDecisionChange] = useState<{
    client_id?: string;
    status?: string;
  }>({});
  const [isDecisionChanged, setIsDecisionChanged] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [activeImageSrc, setActiveImageSrc] = useState("");

  const statusOptions = ["Accept", "Reject"];

  useEffect(() => {
    if (!decisionChange.client_id || !decisionChange.status) return;

    const updateStatus = async () => {
      if (isDecisionChanged) {
        try {
          const decision =
            decisionChange.status?.toLocaleUpperCase() === "ACCEPT"
              ? "ACCEPTED"
              : "REJECTED";

          const response = await apiClient<{ message: string }>(
            `/status/${decisionChange.client_id}`,
            {
              method: "POST",
              body: { status: decision },
            },
          );

          // response is already parsed JSON
          showSuccess(response.message);
        } catch (error) {
          if (error instanceof ApiError) {
            showError(`Update failed (status: ${error.status})`);
          } else {
            showError("An unexpected error occurred.");
          }
        } finally {
          setIsDecisionChanged(false);
        }
      }
    };

    updateStatus();
  }, [decisionChange, isDecisionChanged]);
  const handleStatusChange = (clientId: string, newStatus: string) => {
    setDecisionChange({ client_id: clientId, status: newStatus });
    setIsDecisionChanged(true);
  };

  const handleOpenImage = (imageUrl: string) => {
    const fullImageUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `${licenseLocation}/uploads/${imageUrl}`;
    setActiveImageSrc(fullImageUrl);
    setOpenImageDialog(true);
  };

  return (
    <div className="p-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Clinic Name</TableHead>
              <TableHead>Doctor Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Business License</TableHead>
              <TableHead>Competency License</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{row.name || "N/A"}</TableCell>
                <TableCell>{row.doctorName || "N/A"}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>
                  {row.licensePath ? (
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => handleOpenImage(row.licensePath)}
                    >
                      <Eye className="mr-2 h-4 w-4" /> View
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>
                  {row.competencyPath ? (
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => handleOpenImage(row.competencyPath)}
                    >
                      <Eye className="mr-2 h-4 w-4" /> View
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {statusOptions.map((option) => (
                        <DropdownMenuItem
                          key={option}
                          onClick={() => handleStatusChange(row.id, option)}
                        >
                          {option}
                        </DropdownMenuItem>
                      ))}

                      {/* Extra option if Approved */}
                      {row.status === "ACCEPTED" && (
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/client-credentials/${row.id}`)
                          }
                        >
                          View More
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Image Viewer Dialog */}
      <Dialog open={openImageDialog} onOpenChange={setOpenImageDialog}>
        <DialogContent className="sm:max-w-[80vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Credential Viewer</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            {activeImageSrc ? (
              <Zoom>
                <img
                  src={activeImageSrc}
                  alt="Client Credential"
                  className="max-w-full max-h-[75vh] object-contain rounded-md"
                  onError={() =>
                    console.error("Image failed to load:", activeImageSrc)
                  }
                />
              </Zoom>
            ) : (
              <p className="text-muted-foreground">Image not available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminApprovalTable;
