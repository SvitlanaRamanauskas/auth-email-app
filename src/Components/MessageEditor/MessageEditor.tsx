import cn from "classnames";
import { Editor, EditorState, RichUtils } from "draft-js";
import "./MessageEditor.scss";
import { useState } from "react";

type Props = {
  setEditorState: (value: EditorState) => void;
  editorState: EditorState;
};

export const MessageEditor: React.FC<Props> = ({
  setEditorState,
  editorState,
}) => {
  const [customStyleMap, setCustomStyleMap] = useState<
    Record<string, React.CSSProperties>
  >({});
  const toggleInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const applyColor = (color: string) => {
    const colorKey = `COLOR-${color}`;

    if (!customStyleMap[colorKey]) {
      setCustomStyleMap((prev) => ({
        ...prev,
        [colorKey]: { color },
      }));
    }

    setEditorState(RichUtils.toggleInlineStyle(editorState, colorKey));
  };

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const currentInlineStyle = editorState.getCurrentInlineStyle();

  return (
    <>
      <label htmlFor="message" className="email__label">
        Message:
      </label>

      <div className="message-editor__toolbar">
        <button
          type="button"
          className={cn("message-editor__button", {
            "message-editor__button--active": currentInlineStyle.has("BOLD"),
          })}
          onClick={() => toggleInlineStyle("BOLD")}
        >
          <b>B</b>
        </button>

        <button
          type="button"
          className={cn("message-editor__button", {
            "message-editor__button--active": currentInlineStyle.has("ITALIC"),
          })}
          onClick={() => toggleInlineStyle("ITALIC")}
        >
          <i>I</i>
        </button>

        <button
          type="button"
          className={cn("message-editor__button", {
            "message-editor__button--active":
              currentInlineStyle.has("UNDERLINE"),
          })}
          onClick={() => toggleInlineStyle("UNDERLINE")}
        >
          <u>U</u>
        </button>

        <button
          type="button"
          className={cn("message-editor__button", {
            "message-editor__button--active": currentInlineStyle.has("CODE"),
          })}
          onClick={() => toggleInlineStyle("CODE")}
        >
          <code>{`</>`}</code>
        </button>

        <label htmlFor="color-picker" className="message-editor__label">
          Choose text color:
        </label>
        <input
          type="color"
          id="color-picker"
          onChange={(e) => applyColor(e.target.value)}
        />
      </div>

      <div className="message-editor__input">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          customStyleMap={customStyleMap}
        />
      </div>
    </>
  );
};
