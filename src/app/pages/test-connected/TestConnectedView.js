import { TextField, RadiosField } from 'common/forms'
import ConnectFieldsToggler from './ConnectFieldsToggler'

export default function Test({ onSubmit, leads }) {
  return (
    <form onSubmit={onSubmit}>
      <CustomerFieldRow name="firstName" fieldComponent={TextField} connect={true} />
      <CustomerFieldRow name="lastName" fieldComponent={TextField} connect={true} />
      <button type="submit" className="btn btn-defaut">submit to console</button>
    </form>
  )
}

function CustomerFieldRow({
  connect = false,
  fieldComponent: FieldComponent = TextField,
  name,
}) {
  return (
    <div className="row">
      <div className="col-md-5">
        <FieldComponent name={`customers[0].${name}`} />
      </div>
      <div className="col-md-2">
        <ConnectFieldsToggler names={[
          `customers[0].${name}`,
          `customers[1].${name}`,
        ]} />
      </div>
      <div className="col-md-5">
        <FieldComponent name={`customers[1].${name}`} />
      </div>
    </div>
  )
}
