interface HashtagTextProps {
  text: string;
}

const HashtagText: React.FC<HashtagTextProps> = ({ text }) => {
  const renderPostText = () => {
    const words = text.split(/\s+/);
    const elements: (string | JSX.Element)[] = [];

    words.forEach((word) => {
      if (word.startsWith("#")) {
        elements.push(
          <span key={word} style={{ color: "blue" }}>
            {word}{" "}
          </span>
        );
      } else {
        elements.push(word + " ");
      }
    });

    return elements;
  };

  return <div className="post-text">{renderPostText()}</div>;
};

export default HashtagText;
