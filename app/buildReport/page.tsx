'use client'
import React, { useState } from 'react';
import { Card, DatePicker, Button } from '@tremor/react';

import { Text } from '@tremor/react';
import { ProjectReport } from '@akfreas/tangential-core';

function SelectTemplateStep({ onSelect }: { onSelect: (template: string) => void }) {
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
export default function ReportWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const selectProgram = (program: string) => {
    // setSelectedProgram(program);
    nextStep();
  };

  const selectTemplate = (template: string) => {
    // setSelectedTemplate(template);
    // Here you would typically handle the final submission or go to the next step
  };

  return (
    <div>
      {currentStep === 1 && <SelectTemplateStep onSelect={selectTemplate} />}

      {/* You could conditionally render the Next button based on the current step */}
      {currentStep < 2 && <Button onClick={nextStep}>Next</Button>}
    </div>
  );
};