"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { PageTitle } from "@/components/page-title"

export default function DeleteAccountPage() {
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleRequestDeletion = () => {
    // In a real app, you would send an API request
    // Here we'll just show a success message

    // Create mailto link
    const subject = encodeURIComponent("Account Deletion Request")
    const body = encodeURIComponent(
      "I would like to request my account to be deleted. Please process this request at your earliest convenience."
    )
    const mailtoLink = `mailto:hello@meetingbaas.com?subject=${subject}&body=${body}`

    // Open email client
    window.open(mailtoLink, "_blank")

    toast.success("Email client opened. Please send the email to request account deletion.")
    setShowConfirmation(false)
  }

  return (
    <>
      <PageTitle
        title="Delete Account"
        description="Permanently delete your Meeting BaaS account and all associated data."
      />
      <div className="mt-6 space-y-6">
        <div className="rounded-md border border-destructive bg-destructive/10 p-4">
          <h2 className="mb-2 font-semibold text-destructive text-lg">
            Warning: This action cannot be undone
          </h2>
          <p className="mb-4 text-sm">Deleting your account will:</p>
          <ul className="mb-4 list-disc space-y-1 pl-5 text-sm">
            <li>Permanently delete all your data from our systems</li>
            <li>Cancel all subscriptions and active services</li>
            <li>Remove access to all Meeting BaaS features</li>
            <li>Cannot be reversed or recovered</li>
          </ul>

          <p className="mb-4 text-sm">
            To delete your account, you'll need to send an email to our support team to verify your
            identity and process the request.
          </p>

          {!showConfirmation ? (
            <Button variant="destructive" onClick={() => setShowConfirmation(true)}>
              Request Account Deletion
            </Button>
          ) : (
            <div className="space-y-4 rounded-md border border-destructive p-4">
              <p className="font-medium text-sm">
                Are you absolutely sure you want to delete your account? This action cannot be
                undone.
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleRequestDeletion}>
                  Yes, Send Deletion Request
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
