'use client'
import React, { useState } from 'react';
import { Card, DatePicker, Button, RadioButton } from '@tremor/react';

import { Text } from '@tremor/react';

// Step components (these would be in separate files in a real app)
function SelectProgramStep({ onSelect }) {
  return (
    <Card>
      <div>Select program</div>
      <DatePicker />
      <Card onClick={() => onSelect('newAppMonitoring')}>
        New application monitoring
        <Button>Select</Button>
      </Card>
      <Text onClick={() => onSelect('infraCostMonitoring')}>
        Infra cost monitoring
      </Text>
      <Text onClick={() => onSelect('k8Migration')}>
        K8 migration
      </Text>
    </Card>
  );
};

function SelectTemplateStep({ onSelect }) {
  return (
    <Card>
      <div>Who would you like to update?</div>
      <Text onClick={() => onSelect('vpsAndCSuite')}>
        VPs and C-Suite
      </Text>
      <Text onClick={() => onSelect('productOwners')}>
        Product Owners
      </Text>
      <Text onClick={() => onSelect('engineering')}>
        Engineering
      </Text>
    </Card>
  );
};

// Main Wizard component
export default function ReportWizard({ report}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const selectProgram = (program) => {
    setSelectedProgram(program);
    nextStep();
  };

  const selectTemplate = (template) => {
    setSelectedTemplate(template);
    // Here you would typically handle the final submission or go to the next step
  };

  return (
    <div>
      {currentStep === 1 && <SelectProgramStep onSelect={selectProgram} />}
      {currentStep === 2 && <SelectTemplateStep onSelect={selectTemplate} />}

      {/* You could conditionally render the Next button based on the current step */}
      {currentStep < 2 && <Button onClick={nextStep}>Next</Button>}
    </div>
  );
};