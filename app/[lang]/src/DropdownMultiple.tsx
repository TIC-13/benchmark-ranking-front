import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@nextui-org/react";
import React from "react";

type DropdownMultipleProps = {
    options: DropdownOption[],
    selectedKeys: Set<string>,
    setSelectedKeys: (val: Set<string>) => void
}

type DropdownOption = {
    key: string,
    label: string
}

const DropdownMultiple: React.FC<DropdownMultipleProps> = ({selectedKeys, options, setSelectedKeys}) => {

    const selectedValue = React.useMemo(
      () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
      [selectedKeys]
    );
  
    return (
      <Dropdown>
        <DropdownTrigger>
          <Button 
            variant="bordered" 
            className="capitalize"
          >
            {selectedValue}
          </Button>
        </DropdownTrigger>
        <DropdownMenu 
          aria-label="Multiple selection example"
          variant="flat"
          closeOnSelect={false}
          disallowEmptySelection
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          {
            options.map(option => 
                <DropdownItem key={option.key}>{option.label}</DropdownItem>
            )
          }
        </DropdownMenu>
      </Dropdown>
    );
  }

export default DropdownMultiple