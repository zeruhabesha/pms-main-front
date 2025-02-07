import React, { useMemo } from "react";
import { CFormSelect } from "@coreui/react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./slider.scss"; // Import your custom CSS
import { formatCurrency } from "./utils"; // Import utility function
import { debounce } from "lodash";

const PropertyTableFilters = ({
  properties,
  selectedStatus,
  setSelectedStatus,
  priceRange,
  setPriceRange,
  sliderMax,
  setSliderMax,
}) => {
  const handlePriceSliderChange = debounce((value) => {
    setPriceRange(value);
  }, 10);

  const statusOptions = useMemo(() => {
    const allStatuses = properties.map((property) => property.status || "");
    const uniqueStatuses = Array.from(new Set(allStatuses)).sort();
    return ["", ...uniqueStatuses];
  }, [properties]);

  return (
    <div className="d-flex justify-content-between mb-3">
      <div className="d-flex gap-1" style={{ width: "80%" }}>
        <div style={{ width: "95%" }} className="d-flex  mt-2 gap-1">
          <Slider
            range
            min={0}
            max={sliderMax}
            value={priceRange}
            onChange={handlePriceSliderChange}
            step={100}
            marks={{
              [priceRange[0]]: {
                label: (
                  <div className="rc-slider-mark-text-with-value">
                    {formatCurrency(priceRange[0])}
                  </div>
                ),
              },
              [priceRange[1]]: {
                label: (
                  <div className="rc-slider-mark-text-with-value">
                    {formatCurrency(priceRange[1])}
                  </div>
                ),
              },
            }}
            handle={(props) => {
              const { value, dragging, index, ...restProps } = props;
              return <div {...restProps}></div>;
            }}
          />
        </div>
      </div>

      <CFormSelect
        style={{ width: "20%", minWidth: "200px" }}
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        {statusOptions.map((status, index) => (
          <option key={index} value={status}>
            {status || "All Statuses"}
          </option>
        ))}
      </CFormSelect>
    </div>
  );
};

export default PropertyTableFilters;
