import { HTMLInputTypeAttribute, useState } from "react";

type Props = {
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
  type: HTMLInputTypeAttribute;
  value?: string;
  color?: string;
};
export default function Input(props: Props) {
  const [_value, setValue] = useState(props.value ? props.value : "");
  return (
    <div className="my-3">
      <label
        className={`block text-sm font-medium leading-6 ${
          props.color ? props.color : "text-gray-900"
        }`}
      >
        {props.label}
      </label>
      <div className="mt-2">
        <input
          value={_value}
          onChange={(e) => {
            setValue(e.target.value);
            if (props.type === "date") {
              const date = new Date(e.target.value);
              props.onChange(date.valueOf().toString());
              return;
            }
            props.onChange(e.target.value);
          }}
          type={props.type}
          required={props.required}
          className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-green-200  placeholder:text-gray-900 focus:ring-1 focus:ring-inset focus:ring-green-300 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
