const {useState, useEffect} = React

export function BugFilter({filterBy, onSetFilter}) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

  useEffect(() => {
    onSetFilter(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({target}) {
    const field = target.name
    const value = target.type === 'number' ? +target.value || '' : target.value
    setFilterByToEdit((prevFilterBy) => ({...prevFilterBy, [field]: value}))
  }

  function onSubmitFilter(ev) {
    ev.preventDefault()
    onSetFilter(filterByToEdit)
  }

  // ! DRY!. WE WILL NEVER REPEAT OUR SELVES
  // function handleTxtChange({ target }) {
  //     const value = target.value
  //     setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, txt: value }))
  // }

  // function handleMinSpeedChange({ target }) {
  //     const value = target.value
  //     setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, minSpeed: value }))
  // }

  const {txt, severity} = filterByToEdit
  return (
    <section className="bug-filter full main-layout">
      <h2>Filter Our Bugs</h2>

      <form onSubmit={onSubmitFilter}>
        <label htmlFor="txt">Vendor:</label>
        <input
          value={txt}
          onChange={handleChange}
          name="txt"
          id="txt"
          type="text"
          placeholder="By Text"
        />

        <label htmlFor="severity">Severity:</label>
        <input
          value={severity}
          onChange={handleChange}
          type="number"
          name="severity"
          id="severity"
          placeholder="By Severity"
        />

        <button>Filter Bugs</button>
      </form>

          <select name="sortBy" value={filterBy.sortBy} onChange={handleChange}>
              <option value="createdAt">Created At</option>
              <option value="title">Title</option>
              <option value="severity">Severity</option>
          </select>

          <select name="sortDir" value={filterBy.sortDir} onChange={handleChange}>
              <option value="1">Ascending</option>
              <option value="-1">Descending</option>
          </select>
      </section>
  )
}


