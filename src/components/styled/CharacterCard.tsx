import styled from 'styled-components';
import type { CharacterCombination } from '../../store/characterStore';

export const CharacterCardContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin: 2rem 0;
`;

export const CharacterCard = styled.div<{ isSelected: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  width: 300px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.isSelected ? '#4CAF50' : 'transparent'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

export const CardTitle = styled.h3`
  color: white;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  text-align: center;
`;

export const CharacterList = styled.div`
  color: white;
  margin-top: 1rem;
  
  h4 {
    margin: 0.5rem 0;
    color: #4CAF50;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
    
    &:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #4CAF50;
    }
  }
`; 