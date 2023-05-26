function ResourcesTable({ resources }) {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Type</th>
          <th>Name</th>
          <th>Timeline</th>
        </tr>
      </thead>
      <tbody>
        {!resources && (
          <tr>
            <td colSpan="4">
              <div className="spinner-border"></div>
            </td>
          </tr>
        )}
        {resources?.length === 0 && (
          <tr>
            <td colSpan="4">No assets yet.</td>
          </tr>
        )}
        {resources?.map((r, i) => (
          <tr key={r.id}>
            <td>{i + 1}</td>
            <td>{r?.Resource.type}</td>
            <td>{r?.Resource.name}</td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default ResourcesTable;
