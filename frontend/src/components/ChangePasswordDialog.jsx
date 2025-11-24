// src/components/ChangePasswordDialog.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import api from '../api'; // Assuming your api.js is one level up from components

export function ChangePasswordDialog({ open, onOpenChange }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 8) { // Example validation
      setError('New password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      // You'll need a new backend endpoint for changing passwords
      // For now, let's assume it's /api/change-password/
      await api.post('/api/change-password/', { // <--- You need to implement this backend endpoint!
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSuccessMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => {
        onOpenChange(false); // Close dialog on success
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to change password:', err);
      let errorMsg = 'Failed to change password. Please try again.';
      if (err.response && err.response.data) {
        if (err.response.data.detail) {
          errorMsg = err.response.data.detail;
        } else if (err.response.data.new_password) { 
            errorMsg = `New password: ${err.response.data.new_password.join(', ')}`;
        } else if (typeof err.response.data === 'string') {
            errorMsg = err.response.data;
        }
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
        if (!val) { 
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setError(null);
            setSuccessMessage(null);
        }
        onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and a new password to update your account security.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert className="bg-green-500 text-white"> {/* Custom success alert style */}
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-new-password">Confirm New Password</Label>
            <Input
              id="confirm-new-password"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-green-700 text-white hover:bg-green-800">
              {isLoading ? 'Changing...' : 'Change Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}