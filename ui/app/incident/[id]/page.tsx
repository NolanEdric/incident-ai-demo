import React from 'react';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import Voice from "../../components/voice"
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

export default function IncidentView({ params }: { params: { id: string } }) {
  return (
    <>
      <div className="flex justify-center p-10">
        <div className="w-full sm:w-1/2">
          <form>
            <div className="my-5 flex justify-center">
              <h1 className="text-xl font-semibold leading-7 text-gray-900">Incident Reporting</h1>
            </div>
            <div className="my-5">
              <label htmlFor="id" className="block text-base font-medium leading-6 text-gray-900">
                ID
              </label>
              <div className="mt-2">
                <div className="flex rounded shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                  <input
                    type="text"
                    name="type of near miss"
                    id="id"
                    disabled
                    className="block flex-1 border-gray-300 rounded bg-gray-50 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-base sm:leading-6"
                    value={params.id}
                  />
                </div>
              </div>
            </div>
            <div className="my-5">
              <label htmlFor="id" className="block text-base font-medium leading-6 text-gray-900">
                Date time
              </label>
              <div className="mt-2">
                <DateTimePicker className="bg-gray-50" required value={new Date()} />
              </div>
            </div>
            <div className="my-5">
              <label htmlFor="nearmisstype" className="block text-base font-medium leading-6 text-gray-900">
                Type of Near Miss
              </label>
              <div className="mt-2">
                <div className="flex rounded shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                  <input
                    type="text"
                    name="nearmisstype"
                    list="nearmisstypelist"
                    id="nearmisstype"
                    className="block flex-1 border-gray-300 rounded bg-gray-50 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-base sm:leading-6"
                    placeholder="type of near miss"
                  />
                  <datalist id="nearmisstypelist">
                    <option value="Near Miss" />
                    <option value="Safety Concern" />
                    <option value="Safety Idea/Suggestion" />
                  </datalist>
                </div>
              </div>
            </div>
            <div className="my-5">
              <label htmlFor="concerntype" className="block text-base font-medium leading-6 text-gray-900">
                Type of Concern
              </label>
              <div className="mt-2">
                <div className="flex rounded shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-full">
                  <input
                    type="text"
                    name="concerntype"
                    list="concerntypelist"
                    id="concerntype"
                    className="block flex-1 border-gray-300 rounded bg-gray-50 py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-base sm:leading-6"
                    placeholder="type of concern"
                  />
                  <datalist id="concerntypelist">
                    <option value="Unsafe Act" />
                    <option value="Unsafe Condition of Area" />
                    <option value="Unsafe Condition of Equipment" />
                    <option value="Unsafe Use of Equipment" />
                    <option value="Safety Policy Violation" />
                  </datalist>
                </div>
              </div>
              {/* <Voice /> */}
            </div>
            <div className="my-5">
              <label htmlFor="describeincident" className="block text-base font-medium leading-6 text-gray-900">
                Describe incident by voice
              </label>
              <div className="my-2">
                <Voice />
              </div>
            </div>
            <div className="my-5">
              <label htmlFor="incidentinferresults" className="block text-base font-medium leading-6 text-gray-900">
                Incident AI infererence results
              </label>
              <div className="my-2">ASR</div>
              <div className="my-2">NER</div>
              <div className="my-2">CE</div>
            </div>
            <div className="my-5 flex justify-center">
              <button
                type="submit"
                className="rounded bg-indigo-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
