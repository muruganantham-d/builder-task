import React, { useState, useEffect, useRef } from "react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { CustomerService } from "./CustomerService";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import "../../styles/MyTable.scss";
import { Divider } from "primereact/divider";
import "primeicons/primeicons.css";

export default function CustomersDemo() {
  const [originalCustomers, setOriginalCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [filters, setFilters] = useState({
    firstName: null,
    lastName: null,
    company: null,
  });

  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const dt = useRef(null);
  const toast = useRef(null);

  useEffect(() => {
    CustomerService.getCustomersLarge().then((data) => {
      setOriginalCustomers(data);
      setFilteredCustomers(data);
      setUniqueCompanies([...new Set(data.map((d) => d.company))]);
    });
  }, []);

  const onApplyFilters = () => {
    // Apply filters to the original data
    const newFilteredCustomers = originalCustomers.filter((customer) => {
      const firstNameMatch =
        !filters.firstName ||
        customer.name.toLowerCase().includes(filters.firstName.toLowerCase());
      const lastNameMatch =
        !filters.lastName ||
        customer.name.toLowerCase().includes(filters.lastName.toLowerCase());
      const companyMatch =
        !filters.company || customer.company === filters.company;

      return firstNameMatch && lastNameMatch && companyMatch;
    });

    setFilteredCustomers(newFilteredCustomers);
  };
  ///////
  /////

  const exportCSV = () => {
    if (dt.current) {
      const selectedData = selectedCustomers.map((selectedCustomer) => {
        // Find the selected customer in the filtered data
        return filteredCustomers.find(
          (customer) => customer.id === selectedCustomer.id
        );
      });

      // Remove any undefined/null values from the array
      const cleanedSelectedData = selectedData.filter(Boolean);

      dt.current.exportCSV({ selectionOnly: true, data: cleanedSelectedData });
    } else {
      toast.current.show({
        severity: "warn",
        summary: "Warning",
        detail: "DataTable ref is null",
        life: 3000,
      });
    }
  };

  /////Toolbar
  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Action"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };
  const leftToolbarTemplate = () => {
    return (
      <div className="list-icon">
    
      <i className="pi pi-book" />
      <span>List</span>
    </div>
    )
  };

  return (
    <div className="dashboard-container">
      <div className="overal-input-field">
        <div className="filter-icon">
          <i className="pi pi-filter" />
          <span>Filters</span>
        </div>

        <Divider />
        <div className="input-fields">
          <div  className="input-item">
            <label>First Name</label>
            <InputText
              className="input-item-tag"
              value={filters.firstName}
              onChange={(e) =>
                setFilters({ ...filters, firstName: e.target.value })
              }
              placeholder="Search by first name"
            />
          </div>
          <div  className="input-item">
          <label>Last Name</label>
            <InputText
              className="input-item-tag"
              value={filters.lastName}
              onChange={(e) =>
                setFilters({ ...filters, lastName: e.target.value })
              }
              placeholder="Search by last name"
            />
          </div>
          <div  className="input-item">
          <label>Company</label>
            <Dropdown
              className="input-item-tag"
              value={filters.company}
              options={uniqueCompanies.map((company) => ({
                label: company,
                value: company,
              }))}
              onChange={(e) => setFilters({ ...filters, company: e.value })}
              placeholder="Select a company"
            />
          </div>{" "}
          <div  className="input-item input-item-button">
            <Button
              className="input-item-tag apply-button"
              label="Apply"
              onClick={onApplyFilters}
            />
          </div>
        </div>
      </div>

      <Toast ref={toast} />
      <div className="table-card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <DataTable
          ref={dt}
          value={filteredCustomers}
          paginator
          rows={5}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          rowsPerPageOptions={[10, 25, 50]}
          dataKey="id"
          selectionMode="checkbox"
          selection={selectedCustomers}
          onSelectionChange={(e) => setSelectedCustomers(e.value)}
          emptyMessage="No customers found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column
            selectionMode="multiple"
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="id"
            header="ID"
            sortable
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="name"
            header="Name"
            sortable
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="phone"
            header="Phone Number"
            sortable
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="age"
            header="Age"
            sortable
            style={{ minWidth: "14rem" }}
          />
          <Column
            field="company"
            header="Company"
            sortable
            style={{ minWidth: "14rem" }}
          />
        </DataTable>
      </div>
    </div>
  );
}
