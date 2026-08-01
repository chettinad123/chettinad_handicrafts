import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MessageCircle, PlusCircle, Eye, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../common/apiClient";
import SummaryApi from "../common/SummaryApi";

const statuses = ["new", "read", "responded"];
const STATUS_TO_LABEL = {
  new: "New",
  read: "Read",
  responded: "Responded",
};

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-4 py-2">
      <span className="font-serif text-lg text-[#5B2D07]">{label}</span>
      <span className="text-sm text-[#2A190C]">{value || "—"}</span>
    </div>
  );
}

function contactIcon(method) {
  switch (method) {
    case "Phone":
      return <Phone className="w-4 h-4" />;
    case "WhatsApp":
      return <MessageCircle className="w-4 h-4" />;
    case "Email":
    default:
      return <Mail className="w-4 h-4" />;
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "new":
      return <PlusCircle className="w-4 h-4" />;
    case "read":
      return <Eye className="w-4 h-4" />;
    case "responded":
      return <CheckCircle className="w-4 h-4" />;
    default:
      return null;
  }
}

function getStatusColor(status) {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "read":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "responded":
      return "bg-green-100 text-green-700 border-green-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
}

export default function EnquiryDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchEnquiry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchEnquiry = async () => {
    setLoading(true);
    try {
      const res = await api({
        url: SummaryApi.getEnquiryById.url.replace(":id", id),
        method: SummaryApi.getEnquiryById.method,
      });

      const e = res.data?.data;

      setEnquiry({
        fullName: e.fullName,
        phoneNumber: e.phoneNumber,
        emailAddress: e.emailAddress,
        cityState: e.cityState,
        preferredContactMethod: e.preferredContactMethod,
        subject: e.subject,
        enquiryMessage: e.enquiryMessage,
        status: e.status || "new",
        createdAt: e.createdAt
          ? new Date(e.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load enquiry.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    const prevStatus = enquiry.status;

    // Optimistic update
    setEnquiry((prev) => ({ ...prev, status: newStatus }));

    try {
      await api({
        url: SummaryApi.editEnquiryStatus.url.replace(":id", id),
        method: SummaryApi.editEnquiryStatus.method,
        data: { status: newStatus },
      });
      toast.success(`Status updated to "${STATUS_TO_LABEL[newStatus]}"!`);
    } catch (err) {
      setEnquiry((prev) => ({ ...prev, status: prevStatus })); // revert
      toast.error(err?.response?.data?.message || "Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-sm text-[#2A190C80]">
        Loading enquiry...
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="py-16 text-center text-sm text-[#2A190C80]">
        Enquiry not found.
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#5B2D07]">
            Enquiry Details
          </h1>
          <p className="mt-1 text-sm text-[#2A190C80]">
            Enquiries &gt; Enquiry Details
          </p>
        </div>

        <button
          onClick={() => navigate("/admin-panel/enquiries")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E29C15] text-[#E29C15] hover:bg-[#E29C15] hover:text-white transition-colors px-4 py-2 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Enquiries
        </button>
      </div>

      {/* Content card */}
      <div className="mt-6 rounded bg-[#FDFBF7] p-6 sm:p-8 shadow-sm space-y-10">
        {/* Status Section */}
        <div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="font-serif text-xl text-[#5B2D07]">Enquiry Status</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#2A190C80]">Current Status:</span>
              <div className="flex items-center gap-2">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={updatingStatus || enquiry.status === s}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-all
                      ${
                        enquiry.status === s
                          ? getStatusColor(s) + " cursor-default"
                          : "bg-white text-[#2A190C] border-[#E29C15]/50 hover:bg-[#E29C15]/10 hover:border-[#E29C15]"
                      }
                      ${updatingStatus ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  >
                    {getStatusIcon(s)}
                    {STATUS_TO_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="font-serif text-xl text-[#5B2D07] mb-4">Contact Information</h2>
            <InfoRow label="Full Name" value={enquiry.fullName} />
            <InfoRow label="Phone Number" value={enquiry.phoneNumber} />
            <InfoRow label="Email Address" value={enquiry.emailAddress} />
            <InfoRow label="City / State" value={enquiry.cityState} />
          </div>
          <div>
            <h2 className="font-serif text-xl text-[#5B2D07] mb-4">Enquiry Information</h2>
            <InfoRow label="Date" value={enquiry.createdAt} />
            <div className="grid grid-cols-[160px_1fr] gap-4 py-2 items-center">
              <span className="font-serif text-lg text-[#5B2D07]">Preferred Contact</span>
              <span className="inline-flex items-center gap-1.5 text-sm text-[#2A190C]">
                {contactIcon(enquiry.preferredContactMethod)}
                {enquiry.preferredContactMethod || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Subject & message */}
        <div>
          <h2 className="font-serif text-xl text-[#5B2D07] mb-2">Subject</h2>
          <p className="text-sm text-[#2A190C]">{enquiry.subject}</p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-[#5B2D07] mb-2">Message</h2>
          <p className="text-sm leading-relaxed text-[#5B2D07] whitespace-pre-wrap">
            {enquiry.enquiryMessage}
          </p>
        </div>
      </div>
    </div>
  );
}