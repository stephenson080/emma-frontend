import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import styles from "../../styles/Buttons.module.css";

type Props = {
  title: string;
  visible: boolean;
  onClose: () => void;
  desc: string;
  onsumbit?: () => void;
  submitTitle?: string;
  closeTitle?: string;
  children: any;
  dontShowAction?: boolean;
  loading?: boolean;
};

export default function Modal(props: Props) {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={props.visible} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => {
          if (props.loading) return;
          props.onClose();
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-15 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h1"
                        className="text-3xl font-bold leading-6 text-slate-950"
                      >
                        {props.title}
                      </Dialog.Title>
                      <div className="mt-4">
                        <p className="text-lg text-slate-400">{props.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-transparent">{props.children}</div>
                {!props.dontShowAction && (
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    {props.submitTitle && (
                      <button
                        type="button"
                        className={`${styles.primary} inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto`}
                        onClick={() => {
                          if (props.loading) return;
                          if (props.onsumbit) props.onsumbit();
                        }}
                      >
                        {props.loading ? "Loading" : props.submitTitle}
                      </button>
                    )}
                    {props.closeTitle && (
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => {
                          if (props.loading) return;
                          props.onClose();
                        }}
                        ref={cancelButtonRef}
                      >
                        {props.closeTitle}
                      </button>
                    )}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
