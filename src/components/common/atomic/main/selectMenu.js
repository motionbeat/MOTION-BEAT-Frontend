import styled from "styled-components";
import mainSeleceBar from "../../../../img/selectBar.png"

const SelectMenu = () => {
  return (
    <>
      <SelectMenuWrapper style={{display:"flex", margin:"20px 0"}}>
        <SelectBars></SelectBars>
        <SelectCategory>PLAY</SelectCategory>
        <SelectBars></SelectBars>
      </SelectMenuWrapper>
    </>
  )
}
export default SelectMenu;

const SelectMenuWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`

const SelectBars = styled.div`
  width: 100px;
  height: 10px;
  border-radius: 37px;
  background-image: url(${mainSeleceBar});
  box-shadow: inset 0px 3px 5px rgba(255, 255, 255, 0.5);
  opacity: 0.9;
`

const SelectCategory = styled.div`
  width: 379px;
  height: 62px;
  font-size: 50px;
  color: white;
  text-align: center;
`
