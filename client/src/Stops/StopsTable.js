function StopsTable({ stops, onClickStop }) {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {!stops && (
          <tr>
            <td colSpan="4">
              <div className="spinner-border"></div>
            </td>
          </tr>
        )}
        {stops?.length === 0 && (
          <tr>
            <td colSpan="4">No stops yet.</td>
          </tr>
        )}
        {stops?.map((s, i) => (
          <tr key={s.id} onClick={() => onClickStop(s)} className="clickable">
            <td>{i + 1}</td>
            <td>{s.Stop.names[s.Stop.variants[0].code]}</td>
            <td>{s.Stop.address}</td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default StopsTable;
