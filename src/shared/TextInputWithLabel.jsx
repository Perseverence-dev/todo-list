/**
 * Reusable text input with an associated label.
 * Used by both the add-todo form and the edit-todo form.
 */
function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  ref,
  value,
  placeholder = '',
}) {
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>
      <input
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </>
  );
}

export default TextInputWithLabel;