// フォームフィールドコンポーネント群

export const TextField = ({ label, name, value, onChange, required, type = 'text', placeholder }) => {
  return (
    <div className="mb-4 sm:mb-6 p-3 sm:p-5 border border-gray-200 rounded-lg bg-gray-50">
      <label htmlFor={name} className="block text-sm sm:text-base font-semibold text-blue-700 mb-2 sm:mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'off'}
        inputMode={type === 'email' ? 'email' : type === 'tel' ? 'tel' : type === 'number' ? 'numeric' : 'text'}
        className="w-full px-4 py-3 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
      />
    </div>
  );
};

export const SelectField = ({ label, name, value, onChange, required, options }) => {
  return (
    <div className="mb-6 p-5 border border-gray-200 rounded-lg bg-gray-50">
      <label htmlFor={name} className="block text-base font-semibold text-blue-700 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
      >
        <option value="">選択してください</option>
        {options.map((option, index) => (
          <option key={index} value={typeof option === 'object' ? option.value : option}>
            {typeof option === 'object' ? option.label : option}
          </option>
        ))}
      </select>
    </div>
  );
};

export const RadioField = ({ label, name, value, onChange, required, options, note, hasHtml }) => {
  return (
    <div className="mb-4 sm:mb-6 p-3 sm:p-5 border border-gray-200 rounded-lg bg-gray-50">
      <label className="block text-sm sm:text-base font-semibold text-blue-700 mb-2 sm:mb-3">
        {hasHtml ? (
          <span>
            <span dangerouslySetInnerHTML={{ __html: label }} />
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        ) : (
          <>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </>
        )}
      </label>
      {note && <p className="text-sm text-gray-600 mb-3">{note}</p>}
      <div className="space-y-1">
        {options.map((option, index) => {
          const optionValue = typeof option === 'object' ? option.value : option;
          const optionLabel = typeof option === 'object' ? option.label : option;

          return (
            <label key={index} className="flex items-center cursor-pointer border border-gray-300 rounded-md hover:bg-blue-50 active:bg-blue-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1 p-3 sm:p-3 bg-white transition-all touch-manipulation">
              <input
                type="radio"
                name={name}
                value={optionValue}
                checked={value === optionValue}
                onChange={onChange}
                required={required}
                className="mr-3 text-blue-600 focus:ring-blue-500 w-4 h-4 sm:w-auto sm:h-auto flex-shrink-0"
              />
              <span className="text-sm sm:text-base text-gray-700 select-none">{optionLabel}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export const CheckboxField = ({ label, name, values, onChange, required, options, hasOther, otherValue, onOtherChange }) => {
  return (
    <div className="mb-4 sm:mb-6 p-3 sm:p-5 border border-gray-200 rounded-lg bg-gray-50">
      <label className="block text-sm sm:text-base font-semibold text-blue-700 mb-2 sm:mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="space-y-1 max-h-[400px] sm:max-h-none overflow-y-auto">
        {options.map((option, index) => (
          <label key={index} className="flex items-center cursor-pointer border border-gray-300 rounded-md hover:bg-blue-50 active:bg-blue-100 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-1 p-3 sm:p-3 bg-white transition-all touch-manipulation">
            <input
              type="checkbox"
              name={`${name}_${index}`}
              value={option}
              checked={values.includes(option)}
              onChange={() => onChange(option)}
              className="mr-3 text-blue-600 focus:ring-blue-500 w-4 h-4 sm:w-auto sm:h-auto"
            />
            <span className="text-sm sm:text-base text-gray-700 select-none">{option}</span>
          </label>
        ))}
        {hasOther && (
          <div className="flex items-center border border-gray-300 rounded-md p-3 bg-white sticky bottom-0">
            <input
              type="checkbox"
              name={`${name}_other`}
              checked={values.includes('その他')}
              onChange={() => onChange('その他')}
              className="mr-3 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 mr-2">その他：</span>
            <input
              type="text"
              value={otherValue || ''}
              onChange={onOtherChange}
              placeholder="具体的に入力してください"
              disabled={!values.includes('その他')}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              maxLength="50"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const NumberField = ({ label, name, value, onChange, required, unit, min, max }) => {
  return (
    <div className="mb-6 p-5 border border-gray-200 rounded-lg bg-gray-50">
      <label htmlFor={name} className="block text-base font-semibold text-blue-700 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex items-center">
        <input
          type="number"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          max={max}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
        />
        {unit && <span className="ml-3 text-gray-600 font-medium">{unit}</span>}
      </div>
    </div>
  );
};

export const TextAreaField = ({ label, name, value, onChange, required, maxLength = 500, rows = 4 }) => {
  return (
    <div className="mb-6 p-5 border border-gray-200 rounded-lg bg-gray-50">
      <label htmlFor={name} className="block text-base font-semibold text-blue-700 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        rows={rows}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none bg-white"
      />
      <div className="mt-2 text-sm text-gray-500 text-right">
        {value?.length || 0} / {maxLength} 文字
      </div>
    </div>
  );
};

// グリッド形式のフィールドコンポーネント
export const GridField = ({ label, name, rows, columns, values, onChange, required, type = 'number', selectOptions, onOtherTextChange, firstColumnLabel, note }) => {
  return (
    <div className="mb-6 p-5 border border-gray-200 rounded-lg bg-gray-50">
      <label className="block text-base font-semibold text-blue-700 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {note && <p className="text-sm text-gray-600 mb-3">{note}</p>}

      {/* モバイル用カード表示 */}
      <div className="block sm:hidden space-y-4">
        {rows && rows.map((row, rowIndex) => (
          <div key={rowIndex} className="bg-white border border-gray-300 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-3">{row.label}</h4>
            {row.hasTextField && (
              <input
                type="text"
                name={`${name}_${row.name}_text`}
                value={values?.[`${row.name}_text`] || ''}
                onChange={(e) => onOtherTextChange && onOtherTextChange(row.name, e.target.value)}
                className="w-full mb-3 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="詳細を入力"
              />
            )}
            <div className="space-y-2">
              {columns && columns.map((col, colIndex) => (
                <div key={colIndex} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-600">{col}:</label>
                  {type === 'select' && selectOptions ? (
                    <select
                      name={`${name}_${row.name}_${colIndex}`}
                      value={values?.[row.name]?.[colIndex] || ''}
                      onChange={(e) => onChange(row.name, colIndex, e.target.value)}
                      className="ml-2 flex-1 max-w-[150px] px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">選択</option>
                      {selectOptions && Array.isArray(selectOptions) && selectOptions.map((opt, optIndex) => (
                        <option key={optIndex} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      inputMode={type === 'number' ? 'numeric' : 'text'}
                      name={`${name}_${row.name}_${colIndex}`}
                      value={values?.[row.name]?.[colIndex] || ''}
                      onChange={(e) => onChange(row.name, colIndex, e.target.value)}
                      className="ml-2 flex-1 max-w-[150px] px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder={type === 'number' ? '0' : ''}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* デスクトップ用テーブル表示 */}
      <div className="hidden sm:block overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-blue-50 text-left font-semibold text-gray-700">
                {firstColumnLabel || '項目'}
              </th>
              {columns && columns.map((col, index) => (
                <th key={index} className="border border-gray-300 px-4 py-2 bg-blue-50 text-center font-semibold text-gray-700">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows && rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border border-gray-300 px-4 py-2 bg-white font-medium text-gray-700">
                  {row.label}
                  {row.hasTextField && (
                    <input
                      type="text"
                      name={`${name}_${row.name}_text`}
                      value={values?.[`${row.name}_text`] || ''}
                      onChange={(e) => onOtherTextChange && onOtherTextChange(row.name, e.target.value)}
                      className="ml-2 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="詳細を入力"
                      style={{ maxWidth: '150px' }}
                    />
                  )}
                </td>
                {columns && columns.map((col, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 px-4 py-2 bg-white">
                    {type === 'select' && selectOptions ? (
                      <select
                        name={`${name}_${row.name}_${colIndex}`}
                        value={values?.[row.name]?.[colIndex] || ''}
                        onChange={(e) => onChange(row.name, colIndex, e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">選択</option>
                        {selectOptions && Array.isArray(selectOptions) && selectOptions.map((opt, optIndex) => (
                          <option key={optIndex} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        name={`${name}_${row.name}_${colIndex}`}
                        value={values?.[row.name]?.[colIndex] || ''}
                        onChange={(e) => onChange(row.name, colIndex, e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={type === 'number' ? '0' : ''}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// グリッド選択形式のフィールドコンポーネント
export const GridSelectField = ({ label, name, rows, values, onChange, required, note, options }) => {
  return (
    <div className="mb-6 p-5 border border-gray-200 rounded-lg bg-gray-50">
      <label className="block text-base font-semibold text-blue-700 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {note && <p className="text-sm text-gray-600 mb-3">{note}</p>}
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={index} className="flex items-center gap-4 p-3 border border-gray-300 rounded-lg bg-white">
            <span className="flex-1 font-medium text-gray-700">{row.label}</span>
            <select
              name={`${name}_${row.name}`}
              value={values?.[row.name] || ''}
              onChange={(e) => onChange(row.name, e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">選択</option>
              {(options || ['0人', '1人', '2人', '3人', '4人', '5人', '6～10人', '11～20人', '21人以上']).map((opt, optIndex) => (
                <option key={optIndex} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};