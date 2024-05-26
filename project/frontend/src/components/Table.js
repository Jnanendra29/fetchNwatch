import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Table = (props) => {
  const { month, setMonth } = props;
  const [transaction, setTransaction] = useState("");
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(null);
  const [page, setPage] = useState(1);

  const options = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  useEffect(() => {
    const getRequest = async (url) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
      } catch (error) {
        console.log(error);
        return;
      }
    };
    const response = getRequest(
      `http://localhost:8060/search?dateOfSale=${month}&searchinput=${transaction}&page=${page}`
    );
    response.then((data) => {
      console.log("inside useEffect", data);
      setData(data.result);
      setPage(data.currentPage);
      setTotalPage(data.totalPages);
      // console.log(data.totalPages)
    });
  }, [transaction, month, page]);

  const handleTransaction = (e) => {
    console.log(e.target.value);
    setTransaction(e.target.value);
  };

  const handleChangeMonth = (e) => {
    const value = e.target.value;
    setMonth(value);
  };

  const handleNextPage = () => {
    if (page < totalPage) {
      setPage(page + 1);
    } else {
      console.log("no remaining pages");
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    } else {
      console.log("this is page 1, can't decrement anymore");
    }
  };
  return (
    <div className="tableContainer">
      {/* {JSON.stringify(data)} */}
      <div className="dashboard-heading">
        <nav>
          <Link to="/chart">Chart Page</Link>
        </nav>
        <div className="heading">
          <p>Transaction Dashboard</p>
        </div>
        <nav>
          <Link to="/stat">Statictics Page</Link>
        </nav>
      </div>
      <div className="inputs-div">
        <input
          type="text"
          placeholder="Search transaction"
          onChange={handleTransaction}
          value={transaction}
        />
        <select
          value={month}
          onChange={handleChangeMonth}
          className="selectoption"
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="table-div">
        <ul>
          <li>ID</li>
          <li>Title</li>
          <li>Description</li>
          <li>Price</li>
          <li>Category</li>
          <li>Sold</li>
          <li>Image</li>
        </ul>
        {data.length > 0 ? (
          data.map((item, index) => (
            <ul key={item.id} className="ul-class">
              <li>{item.id}</li>
              <li>{item.title}</li>
              <li>{item.description}</li>
              <li>{item.price}</li>
              <li>{item.category}</li>
              <li>{item.sold ? "Yes" : "No"}</li>
              <li>
                <img src={item.image} alt="" />
              </li>
            </ul>
          ))
        ) : (
          <h1>No Result Found</h1>
        )}
      </div>
      <div className="footer-div">
        <p>Page No: {page}</p>
        <div style={{ display: "flex" }}>
          <p onClick={handleNextPage} style={{ cursor: "pointer" }}>
            Next &nbsp; - &nbsp;
          </p>
          <p onClick={handlePreviousPage} style={{ cursor: "pointer" }}>
            Previous
          </p>
        </div>
        <p>Per Page: 10</p>
      </div>
    </div>
  );
};

export default Table;
