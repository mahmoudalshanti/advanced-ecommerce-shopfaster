"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import axios from "axios";

function SelectCountry({
  handleSelectChange,
}: {
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  country: string;
  handleSelectChange: (selectedCountry: string) => void;
}) {
  const [countries, setCountries] = useState<{ name: string; code: string }[]>(
    []
  );

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countriesData = response.data.map((country: any) => ({
          name: country.name.common,
          code: country.cca2,
        }));
        setCountries(countriesData);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div>
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger className="w-[180px] text-lg font-semibold max-w-lg ml-5 text-gray-500 underline">
          <SelectValue placeholder={"Change"} />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectCountry;
