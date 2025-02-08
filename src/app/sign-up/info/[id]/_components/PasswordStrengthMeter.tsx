"use client";

import { Check, X } from "lucide-react";

interface Criteria {
  label: string;
  met: boolean;
}
const PasswordCriteria = ({
  criteria,
  focus,
}: {
  criteria: Criteria[];
  focus: boolean;
}) => {
  return (
    <div className="mt-2 space-y-1">
      {criteria?.map((item: any) => (
        <div key={item.label} className="flex items-center text-sm">
          {item.met ? (
            <Check className="size-4 text-green-700 mr-2" />
          ) : (
            <X
              className={`size-4  text-gray-500 mr-2 ${
                focus && "text-red-600 font-semibold"
              }`}
            />
          )}
          <span
            className={
              item.met
                ? "text-green-700"
                : `text-gray-500 ${focus && "text-red-600 font-semibold"}`
            }
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({
  criteria,
  focus,
}: {
  criteria: Criteria[];
  focus: boolean;
}) => {
  return (
    <div className="mt-2">
      <PasswordCriteria criteria={criteria} focus={focus} />
    </div>
  );
};

export default PasswordStrengthMeter;
