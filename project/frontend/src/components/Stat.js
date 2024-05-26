import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Stat = (props) => {
  const { month } = props;
  const [data, setData] = useState(null);

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

    const response = getRequest(`http://localhost:8060/searchmonth/${month}`);
    response
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.log("error inside useEffect stat folder", error);
      });
  }, [month]);

  return (
    <div className="statContainer">
      {/* {data ? JSON.stringify(data) : "no data yet"} */}
      <h2>Statictics &nbsp; - &nbsp;{month}</h2>
      {data ? (
        <div className="stats">
          <p>
            <span>Total sale</span> <span>{data.TotalSales}</span>
          </p>
          <p>
          <span>Total sold item</span> <span>{data.SoldItems}</span>{" "}
          </p>
          <p>
          <span>Total not sold item</span> <span>{data.UnsoldItems}</span>{" "}
          </p>
        </div>
      ) : (
        "No data yet"
      )}
      <p>
        <Link to="/">Back to Table Content</Link>
      </p>
    </div>
  );
};

export default Stat;
