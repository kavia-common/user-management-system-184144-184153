import React from 'react';
import './ui.css';

/**
 * PUBLIC_INTERFACE
 * Table renders a simple accessible data table.
 * Props:
 * - columns: Array<{ key: string, header: string, render?: (row) => node }>
 * - data: Array<any>
 * - caption: string (optional)
 * - rowKey: string | (row) => string
 * - actions: (row) => node (optional action cell)
 */
export default function Table({ columns = [], data = [], caption, rowKey = 'id', actions }) {
  const getKey = (row, index) => {
    if (typeof rowKey === 'function') return rowKey(row, index);
    return row[rowKey] ?? index;
  };
  return (
    <div className="ui-table-wrap">
      <table className="ui-table">
        {caption && <caption style={{ textAlign: 'left', padding: '8px 12px' }}>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col">{c.header}</th>
            ))}
            {actions && <th scope="col" aria-label="Actions">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} style={{ padding: 16, color: 'rgba(17,24,39,0.7)' }}>
                No records
              </td>
            </tr>
          ) : data.map((row, idx) => (
            <tr key={getKey(row, idx)}>
              {columns.map((c) => (
                <td key={c.key}>
                  {c.render ? c.render(row) : String(row[c.key] ?? '')}
                </td>
              ))}
              {actions && <td>{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
