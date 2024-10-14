const fs = require("fs");
const path = require("path");

const toBase64 = (filepath) => {
  return fs.readFileSync(filepath).toString("base64");
};
const bgLeft = toBase64(path.join(__dirname, "../../../public/bg-l.png"));
const USAID = toBase64(path.join(__dirname, "../../../public/usaid.png"));
const MBC = toBase64(path.join(__dirname, "../../../public/mbc-logo.png"));
const bgRight = toBase64(path.join(__dirname, "../../../public/bg-r.png"));

const getImageSrc = (base64String) => `data:image/png;base64,${base64String}`;

const Ecert = ({ name, date }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const dateObj = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", options).format(dateObj);
  };
  return `<div style="display: flex; justify-content: center; align-items: center; padding: 0; margin: 0;">
      <div style="flex: 1; display: flex; justify-content: flex-start; align-items: center; margin-right: 16px; height: 985px;">
        <img
          src="${getImageSrc(bgLeft)}"
          alt="Background Left"
          style="height: 985px; width: auto;"
        />
      </div>
      <div style="border: 4px solid black; padding: 24px; width: 1000px; height: 750px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="width: 100%; height: auto; text-align: center; font-family: 'Poppins'; display: flex; flex-direction: column; align-items: center;">
          <div style="display: flex; justify-content: center; gap: 10px; width: 100%; margin-bottom: 16px;">
            <img src="${getImageSrc(USAID)}" alt="Image 1" style="width: 260px;" />
            <img src="${getImageSrc(MBC)}" alt="Image 2" style="width: 150px;" />
          </div>

          <div style="margin-bottom: 24px;">
            <h2 style="font-size: 50px; font-weight: bold; margin-bottom: 16px; color: var(--primary);">
              ${name}
            </h2>
            <p style="font-size: 2rem; margin-bottom: 16px;">
              Has successfully completed the Digital Democracy eLearning Course
            </p>
            <p style="font-size: 2rem;">${formatDate(date)}</p>
          </div>

          <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 20px; padding: 0 16px;">
            <div style="text-align: center; display: flex; flex-direction: column; align-items: center; width: 50%; padding-right: 16px;">
              <div
                alt="Signature 1"
                style="width: 200px; margin-bottom: 8px;"
              ></div>
              <div style="border-top: 1px solid black; margin-top: 8px; width: 300px; margin: auto;"></div>
              <p style="margin-top: 4px; font-size: 1.25rem; font-weight: bold;">
                Sergio M. Andal Jr.
              </p>
              <p style="font-size: 1rem;">Chief of Party</p>
              <p style="font-size: 1rem;">USAID CHANGE Project</p>
            </div>
            <div style="text-align: center; display: flex; flex-direction: column; align-items: center; width: 50%; padding-left: 16px;">
              <div
                alt="Signature 1"
                style="width: 200px; margin-bottom: 8px;"
              ></div>
              <div style="border-top: 1px solid black; margin-top: 8px; width: 300px; margin: auto;"></div>
              <p style="margin-top: 4px; font-size: 1.25rem; font-weight: bold;">
                Roberto F. Batungbacal
              </p>
              <p style="font-size: 1rem;">Executive Director</p>
              <p style="font-size: 1rem;">Makati Business Club</p>
            </div>
          </div>
        </div>
      </div>
      <div style="flex: 1; display: flex; justify-content: flex-end; align-items: center; margin-left: 14px; height: 985px;">
        <img
          src="${getImageSrc(bgRight)}"
          alt="Background Right"
          style="height: 985px; width: auto;"
        />
      </div>
    </div>`;
};

module.exports = Ecert;
