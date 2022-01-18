export enum TextFormats {
  reset = '\x1b[0m',
  bright = '\x1b[1m',
  dim = '\x1b[2m',
  underscore = '\x1b[4m',
  blink = '\x1b[5m',
  reverse = '\x1b[7m',
  hidden = '\x1b[8m'
}

export enum TextColors {
  black = '\x1b[30m',
  red = '\x1b[31m',
  green = '\x1b[32m',
  yellow = '\x1b[33m',
  blue = '\x1b[34m',
  magenta = '\x1b[35m',
  cyan = '\x1b[36m',
  white = '\x1b[37m',
  crimson = '\x1b[38m'
}

export enum BackgroundColors {
  black = '\x1b[40m',
  red = '\x1b[41m',
  green = '\x1b[42m',
  yellow = '\x1b[43m',
  blue = '\x1b[44m',
  magenta = '\x1b[45m',
  cyan = '\x1b[46m',
  white = '\x1b[47m',
  crimson = '\x1b[48m'
}

export type FormatOptions = {
  textFormat?: keyof typeof TextFormats | (keyof typeof TextFormats)[];
  textColor?: keyof typeof TextColors;
  backgroundColor?: keyof typeof BackgroundColors;
  addLineBreak?: boolean;
};

export type ValueToPrint = string | number | boolean | undefined;

export class ConsoleFormat {
  public static make (value: ValueToPrint, options?: FormatOptions) {
    let formattedValue = String(value);
    if (options?.textFormat) {
      if (options.textFormat instanceof Array) {
        options.textFormat.forEach(format => {
          formattedValue = TextFormats[format].concat(formattedValue);
        });
      } else {
        formattedValue = TextFormats[options.textFormat].concat(formattedValue);
      }
    }

    if (options?.textColor) {
      formattedValue = TextColors[options.textColor].concat(formattedValue);
    }

    if (options?.backgroundColor) {
      formattedValue = BackgroundColors[options.backgroundColor].concat(formattedValue);
    }

    formattedValue = formattedValue.concat(TextFormats.reset);

    if (options?.addLineBreak) {
      formattedValue = formattedValue.concat('\n');
    }

    return formattedValue;
  }
}
