import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import EditUserForm from './editUser';
import { User } from "@/types";

interface EditUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userData: User;
  primaryColor: string;
  userId:string;
}

const EditUserDialog = ({userId, isOpen, onClose, userData, primaryColor }: EditUserDialogProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel 
                className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-2xl transition-all"
                style={{ borderTop: `4px solid ${primaryColor}` }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <DialogTitle
                      as="h3"
                      className="text-xl font-semibold leading-6 text-gray-900"
                    >
                      Edit User Profile
                    </DialogTitle>
                    <p className="mt-1 text-sm text-gray-500">
                      Update user details and permissions
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                    aria-label="Close"
                    type="button"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="max-h-[70vh] overflow-y-auto">
                  <EditUserForm 
                    userData={userData} 
                    onCloseModal={onClose}
                    primaryColor={primaryColor}
                  />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditUserDialog;