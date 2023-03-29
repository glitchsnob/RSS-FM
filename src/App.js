import { useState, useEffect, useCallback } from "react";
import Parser from "rss-parser";
import "./tailwind.output.css";
import circuitBoardImage from "../public/circuit-board.svg";
import debounce from "lodash.debounce";
import sources from "./sources";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function MyComponent() {
  const [rssUrl, setRssUrl] = useState("");
  const [rssData, setRssData] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleInputChange = (event) => {
    setRssUrl(event.target.value);
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  const fetchRssData = useCallback(
    debounce((url) => {
      if (url !== "") {
        const parser = new Parser();
        const proxyUrl = "https://cors-anywhere.herokuapp.com/";

        parser
          .parseURL(proxyUrl + url)
          .then((feed) => {
            setRssData(feed.items.slice(0, 10));
          })
          .catch((error) => console.log("Error fetching feed:", error));
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchRssData(rssUrl);
  }, [rssUrl, fetchRssData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric"
    };

    return date.toLocaleDateString("en-US", options);
  };

  const handleSourceClick = (sourceRss) => {
    setRssUrl(sourceRss);
  };

  return (
    <div
      className="container-2xl px-8 py-12"
      style={{ backgroundImage: `url(${circuitBoardImage})` }}
    >
      <label className="block">
        <input
          type="text"
          placeholder="Enter RSS URL"
          value={rssUrl}
          onChange={handleInputChange}
          className={`appearance-none block w-full bg-gray-300 text-gray-700 border border-orange-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
        />
      </label>
      <div>
        <Carousel
          className="mt-8 bg-gray-800 bg-opacity-50 rounded-lg "
          showThumbs={false}
          showStatus={false}
          showIndicators={false}
          swipeable={true}
          dynamicHeight={false}
          centerMode
          centerSlidePercentage={25}
          autoPlay={true}
          interval={1500}
          infiniteLoop={true}
        >
          {sources.map((source) => (
            <div
              key={source.name}
              onClick={() => handleSourceClick(source.rss)}
              className=" mt-2 border-none flex flex-col items-center cursor-pointer p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <img
                src={source.logo}
                alt={source.name}
                className="h-16 border-none object-contain mb-2"
              />
              <p className=" border-none text-center"></p>
            </div>
          ))}
        </Carousel>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {rssData.map((item) => (
          <div
            key={item.guid}
            className="bg-white p-6 rounded-lg shadow-lg cursor-pointer"
            onClick={() => handleArticleClick(item)}
          >
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-gray-600 text-sm mt-2">
              {item.description ? item.description.slice(0, 100) + "..." : ""}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Author: {item.creator || item.author}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Published on: {formatDate(item.pubDate)}
            </p>
          </div>
        ))}
      </div>
      {selectedArticle && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="text-gray-700 font-semibold float-right cursor-pointer"
              onClick={handleCloseModal}
            >
              &times;
            </span>
            <h2 className="text-2xl font-semibold">{selectedArticle.title}</h2>
            <p className="text-gray-600 mt-2">{selectedArticle.description}</p>
            <p className="text-gray-500 text-sm mt-4">
              Author: {selectedArticle.creator || selectedArticle.author}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Published on: {formatDate(selectedArticle.pubDate)}
            </p>
            <a
              href={selectedArticle.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mt-4 inline-block"
            >
              Read More
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
export default MyComponent;
