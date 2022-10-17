/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {fireEvent, render} from '@react-spectrum/test-utils';
import React from 'react';
import {ToggleButton} from '../';
import userEvent from '@testing-library/user-event';

describe('ToggleButton', () => {
  it('should render a toggle button with default class', () => {
    let {getByRole} = render(<ToggleButton>Test</ToggleButton>);
    let button = getByRole('button');
    expect(button).toHaveAttribute('class', 'react-aria-ToggleButton');
  });

  it('should render a toggle button with custom class', () => {
    let {getByRole} = render(<ToggleButton className="test">Test</ToggleButton>);
    let button = getByRole('button');
    expect(button).toHaveAttribute('class', 'test');
  });

  it('should support DOM props', () => {
    let {getByRole} =  render(<ToggleButton data-foo="bar">Test</ToggleButton>);
    let button = getByRole('button');
    expect(button).toHaveAttribute('data-foo', 'bar');
  });

  it('should support hover', () => {
    let {getByRole} = render(<ToggleButton className={({isHovered}) => isHovered ? 'hover' : ''}>Test</ToggleButton>);
    let button = getByRole('button');

    expect(button).not.toHaveAttribute('data-hovered');
    expect(button).not.toHaveClass('hover');

    userEvent.hover(button);
    expect(button).toHaveAttribute('data-hovered', 'true');
    expect(button).toHaveClass('hover');

    userEvent.unhover(button);
    expect(button).not.toHaveAttribute('data-hovered');
    expect(button).not.toHaveClass('hover');
  });

  it('should support focus ring', () => {
    let {getByRole} = render(<ToggleButton className={({isFocusVisible}) => isFocusVisible ? 'focus' : ''}>Test</ToggleButton>);
    let button = getByRole('button');
    
    expect(button).not.toHaveAttribute('data-focus-visible');
    expect(button).not.toHaveClass('focus');

    userEvent.tab();
    expect(document.activeElement).toBe(button);
    expect(button).toHaveAttribute('data-focus-visible', 'true');
    expect(button).toHaveClass('focus');

    userEvent.tab();
    expect(button).not.toHaveAttribute('data-focus-visible');
    expect(button).not.toHaveClass('focus');
  });

  it('should support press state', () => {
    let onPress = jest.fn();
    let {getByRole} = render(<ToggleButton className={({isPressed}) => isPressed ? 'pressed' : ''} onPress={onPress}>Test</ToggleButton>);
    let button = getByRole('button');

    expect(button).not.toHaveAttribute('data-pressed');
    expect(button).not.toHaveClass('pressed');

    fireEvent.mouseDown(button);
    expect(button).toHaveAttribute('data-pressed', 'true');
    expect(button).toHaveClass('pressed');

    fireEvent.mouseUp(button);
    expect(button).not.toHaveAttribute('data-pressed');
    expect(button).not.toHaveClass('pressed');

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should support disabled state', () => {
    let {getByRole} = render(<ToggleButton isDisabled className={({isDisabled}) => isDisabled ? 'disabled' : ''}>Test</ToggleButton>);
    let button = getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled');
  });

  it('should support selected state', () => {
    let onChange = jest.fn();
    let {getByRole} = render(<ToggleButton onChange={onChange} className={({isSelected}) => isSelected ? 'selected' : ''}>Test</ToggleButton>);
    let button = getByRole('button');

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).not.toHaveClass('selected');

    userEvent.click(button);
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveClass('selected');

    userEvent.click(button);
    expect(onChange).toHaveBeenLastCalledWith(false);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).not.toHaveClass('selected');
  });
});