import styled from "styled-components";
import mainSeleceBar from "../../../../img/selectBar.png"
import "../../../../styles/main/selectMenu.scss"

const SelectMenu = ({mainMenu}) => {
  return (
    <>
      <SelectMenuWrapper style={{display:"flex", margin:"20px 0"}}>
        <SelectBars>
          <img src={mainSeleceBar} alt="선택 테두리" />
        </SelectBars>
        <div className="selectCategory">
          <span className="categoryText">{mainMenu}</span>
        </div>
        <SelectBars>
          <img src={mainSeleceBar} alt="선택 테두리" />
        </SelectBars>
      </SelectMenuWrapper>
    </>
  )
}
export default SelectMenu;

const SelectMenuWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
`

const SelectBars = styled.div`
  width: 100px;
  height: 10px;
  border-radius: 37px;
  align-items: center;
  opacity: 0.9;
  display: flex;
  // background-image: url(${mainSeleceBar});
  // box-shadow: inset 0px 3px 5px rgba(255, 255, 255, 0.5);

  // img {
  //   height: 100%;
  //   width: auto;
  // }
`
