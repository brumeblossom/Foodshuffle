import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Tag } from '../../components/Tag';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import type { SelectOption } from '../../components/Select';
import { MultiSelect } from '../../components/MultiSelect';
import type { MultiSelectOption } from '../../components/MultiSelect';
import { Stepper } from '../../components/Stepper';
import { ProgressBar } from '../../components/ProgressBar';
import { Modal } from '../../components/Modal';
import { useUiStore } from '../../app/uiStore';

export const SinkPage: React.FC = () => {
  const addToast = useUiStore((state) => state.addToast);

  // States
  const [textValue, setTextValue] = useState('');
  const [errorValue, setErrorValue] = useState('This field has an error');
  const [selectValue, setSelectValue] = useState('nigerian');
  const [selectedMulti, setSelectedMulti] = useState<string[]>(['vegan']);
  const [stepperValue, setStepperValue] = useState(4);
  const [progressValue, setProgressValue] = useState(35);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const kitchenSelectOptions: SelectOption[] = [
    { value: 'nigerian', label: 'Nigerian Cuisine' },
    { value: 'italian', label: 'Italian Cuisine' },
    { value: 'indian', label: 'Indian Cuisine' },
    { value: 'mexican', label: 'Mexican Cuisine' },
  ];

  const kitchenMultiOptions: MultiSelectOption[] = [
    { value: 'vegan', label: 'Vegan' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'gluten_free', label: 'Gluten-Free' },
    { value: 'keto', label: 'Keto' },
    { value: 'low_carb', label: 'Low-Carb' },
  ];

  return (
    <div className="space-y-8">
      {/* Tab: Kitchen Sink */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-full border-b border-primary/10 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight">UI Primitives & Kitchen Sink</h1>
          <p className="text-text-muted mt-1 text-sm">
            A comprehensive checklist of all foundation tokens, dark/light modes, keyboard-accessible components, and design aesthetics in FoodShuffle.
          </p>
        </div>

        {/* Buttons & Tags */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold font-display border-b border-primary/10 pb-2">1. Buttons & Tags</h2>
          <Card className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Button Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Action</Button>
                <Button variant="accent">Accent Action</Button>
                <Button variant="danger">Danger Action</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Grocery Label Accent Tags</h3>
              <div className="flex flex-wrap gap-3">
                <Tag variant="primary">Primary Tag</Tag>
                <Tag variant="accent">Accent Tag</Tag>
                <Tag variant="highlight">Sunshine Accent</Tag>
                <Tag variant="success">Kiwi Accent</Tag>
                <Tag variant="danger">Danger Tag</Tag>
              </div>
            </div>
          </Card>
        </section>

        {/* Form Fields */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold font-display border-b border-primary/10 pb-2">2. Form Fields</h2>
          <Card className="space-y-4">
            <Input
              label="Standard Text Input"
              placeholder="Type something..."
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              helperText="Helper text describes input requirements."
            />

            <Input
              label="Input with Error State"
              placeholder="Error text field..."
              value={errorValue}
              onChange={(e) => setErrorValue(e.target.value)}
              error={errorValue ? 'This value is invalid' : undefined}
            />

            <Select
              label="Dropdown Selector"
              options={kitchenSelectOptions}
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
            />

            <MultiSelect
              label="Multi-Select Tags (Select Diets)"
              placeholder="Choose diets..."
              options={kitchenMultiOptions}
              selectedValues={selectedMulti}
              onChange={setSelectedMulti}
            />
          </Card>
        </section>

        {/* Steppers & Progress */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold font-display border-b border-primary/10 pb-2">3. Steppers & Progress Bars</h2>
          <Card className="space-y-6">
            <Stepper
              label="Slider & Stepper (Servings Count)"
              value={stepperValue}
              min={1}
              max={12}
              step={1}
              unit=" servings"
              onChange={setStepperValue}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-text">ProgressBar Control</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setProgressValue(Math.max(0, progressValue - 10))}>-10%</Button>
                  <Button variant="ghost" size="sm" onClick={() => setProgressValue(Math.min(100, progressValue + 10))}>+10%</Button>
                </div>
              </div>
              <ProgressBar label="Generation Progress" value={progressValue} showPercentage />
            </div>
          </Card>
        </section>

        {/* Interactive Triggers */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold font-display border-b border-primary/10 pb-2">4. Dialogs & Interactive Triggers</h2>
          <Card className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Overlay Dialog Modal</h3>
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Open Modal Window
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Toast Notifications</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="ghost" onClick={() => addToast('Successfully generated plan!', 'success')}>
                  Trigger Success Toast
                </Button>
                <Button variant="ghost" onClick={() => addToast('Failed to connect to database.', 'danger')}>
                  Trigger Danger Toast
                </Button>
                <Button variant="ghost" onClick={() => addToast('Recipes loaded from database cache.', 'info')}>
                  Trigger Info Toast
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>

      {/* Modal - Confirms selection */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Selection">
        <div className="space-y-4">
          <p className="text-sm">
            Are you sure you want to finalize this action? This will update the state configuration dynamically.
          </p>
          <div className="flex justify-end gap-3 pt-3 border-t border-primary/10">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => {
              setIsModalOpen(false);
              addToast('Confirmed!', 'success');
            }}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default SinkPage;
