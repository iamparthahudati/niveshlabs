import React from "react";
import { Icon } from "@/components/ui/Icon";

export interface SearchFormProps {
  id?: string;
  placeholder?: string;
  action?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

export function SearchForm({
  id = "site-search",
  placeholder = "Search stocks, funds, tools...",
  action = "/search",
  className = "search-form",
  inputClassName = "",
  buttonClassName = "",
}: SearchFormProps) {
  return (
    <form className={className} role="search" action={action} method="get">
      <label className="sr-only" htmlFor={id}>
        Search NiveshLabs
      </label>
      <input
        id={id}
        name="query"
        type="search"
        placeholder={placeholder}
        autoComplete="off"
        className={inputClassName}
      />
      <button
        type="submit"
        className={buttonClassName}
        aria-label="Submit search"
      >
        <Icon name="search" size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
