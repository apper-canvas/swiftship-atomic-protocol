import React from 'react'
      import Input from '@/components/atoms/Input'
      import Select from '@/components/atoms/Select'
      import Textarea from '@/components/atoms/Textarea'
      import Label from '@/components/atoms/Label'

      const FormField = ({ label, type = 'text', name, value, onChange, placeholder, required, options, className, ...props }) => {
        const inputProps = { name, value, onChange, placeholder, required, className, ...props }

        let FieldComponent
        switch (type) {
          case 'select':
            FieldComponent = <Select options={options} {...inputProps} />
            break
          case 'textarea':
            FieldComponent = <Textarea {...inputProps} />
            break
          default:
            FieldComponent = <Input type={type} {...inputProps} />
        }

        return (
          <div>
            {label && <Label htmlFor={name}>{label}</Label>}
            {FieldComponent}
          </div>
        )
      }

      export default FormField