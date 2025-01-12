/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import React, { useState, useEffect } from "react";
import { Localized } from "./MSLocalized";

export const ColorwayDescription = props => {
  const { colorway } = props;
  if (!colorway) {
    return null;
  }
  const { label, description } = colorway;
  return (
    <Localized text={description}>
      <div
        className="colorway-text"
        data-l10n-args={JSON.stringify({
          colorwayName: label,
        })}
      />
    </Localized>
  );
};

// Return colorway as "default" for default theme variations Automatic, Light, Dark,
// Alpenglow theme and legacy colorways which is not supported in Colorway picker.
// For themes other then default, theme names exist in
// format colorway-variationId inside LIGHT_WEIGHT_THEMES in AboutWelcomeParent
export function computeColorWay(themeName, systemVariations) {
  return !themeName ||
    themeName === "alpenglow" ||
    systemVariations.includes(themeName)
    ? "default"
    : themeName.split("-")[0];
}

export function Colorways(props) {
  let {
    colorways,
    defaultVariationIndex,
    systemVariations,
    variations,
  } = props.content.tiles;

  // This sets a default value
  const activeId = computeColorWay(props.activeTheme, systemVariations);
  const [colorwayId, setState] = useState(activeId);

  // Update state any time activeTheme changes.
  useEffect(() => {
    setState(computeColorWay(props.activeTheme, systemVariations));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.activeTheme]);

  return (
    <div className="tiles-theme-container">
      <div>
        <fieldset className="tiles-theme-section">
          <Localized text={props.content.subtitle}>
            <legend className="sr-only" />
          </Localized>
          {colorways.map(({ id, label, tooltip }) => (
            <Localized
              key={id + label}
              text={typeof tooltip === "object" ? tooltip : {}}
            >
              <label
                className="theme"
                title={label}
                data-l10n-args={JSON.stringify({
                  colorwayName: label,
                })}
              >
                <Localized text={typeof label === "object" ? label : {}}>
                  <span
                    className="sr-only colorway label"
                    id={`${id}-label`}
                    data-l10n-args={JSON.stringify({
                      colorwayName: label,
                    })}
                  />
                </Localized>
                <Localized text={typeof label === "object" ? label : {}}>
                  <input
                    type="radio"
                    data-colorway={id}
                    name="theme"
                    value={
                      id === "default"
                        ? systemVariations[defaultVariationIndex]
                        : `${id}-${variations[defaultVariationIndex]}`
                    }
                    checked={colorwayId === id}
                    className="sr-only input"
                    onClick={props.handleAction}
                    data-l10n-args={JSON.stringify({
                      colorwayName: label,
                    })}
                    aria-labelledby={`${id}-label`}
                  />
                </Localized>
                <div
                  className={`icon colorway ${
                    colorwayId === id ? "selected" : ""
                  } ${id}`}
                />
              </label>
            </Localized>
          ))}
        </fieldset>
      </div>
      <ColorwayDescription
        colorway={colorways.find(colorway => colorway.id === activeId)}
      />
    </div>
  );
}
