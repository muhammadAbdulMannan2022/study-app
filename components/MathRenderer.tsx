
import React from 'react';
import { WebView } from 'react-native-webview';
import { Text, View } from 'react-native';

const katexStyle = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous">`;
const katexScript = `<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" integrity="sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8" crossorigin="anonymous"></script>`;
const autoRenderScript = `<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05" crossorigin="anonymous"></script>`;

const generateHtml = (content: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    ${katexStyle}
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            font-size: 18px; 
            line-height: 1.6; 
            color: #1f2937; 
            padding: 12px; 
            margin: 0; 
            background-color: transparent;
        }
        .katex { font-size: 1.1em; }
        .katex-display { margin: 1em 0; overflow-x: auto; overflow-y: hidden; }
        img { max-width: 100%; height: auto; }
        strong { font-weight: 700; color: #111827; }
        em { font-style: italic; }
    </style>
    ${katexScript}
    ${autoRenderScript}
</head>
<body>
    <textarea id="content" style="display:none;">${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
    <div id="render-target"></div>

    <script>
      document.addEventListener("DOMContentLoaded", function() {
        const rawContent = document.getElementById('content').value;
        
        const mathSegments = [];
        const mathRegex = /(\\$\\$[\\s\\S]*?\\$\\$|\\$[\\s\\S]*?\\$|\\\\[[\\s\\S]*?\\\\]|\\\\([\\s\\S]*?\\\\))/g;
        
        const protectedText = rawContent.replace(mathRegex, function(match) {
            mathSegments.push(match);
            return '<span class="math-placeholder" data-index="' + (mathSegments.length - 1) + '"></span>';
        });

        const html = protectedText
            .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
            .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
            .replace(/\\n/g, '<br>');

        const target = document.getElementById('render-target');
        target.innerHTML = html;

        // Restore Math
        const placeholders = document.querySelectorAll('.math-placeholder');
        placeholders.forEach(el => {
            const index = parseInt(el.getAttribute('data-index'));
            if (mathSegments[index]) {
                const textNode = document.createTextNode(mathSegments[index]);
                el.parentNode.replaceChild(textNode, el);
            }
        });

        renderMathInElement(target, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\\\(', right: '\\\\)', display: false},
            {left: '\\\\[', right: '\\\\]', display: true}
          ],
          throwOnError : false
        });

        // Send height to React Native
        // Use a loop to detect height changes (e.g. after images load)
        function sendHeight() {
            var height = document.body.scrollHeight;
            window.ReactNativeWebView.postMessage(height);
        }
        
        setTimeout(sendHeight, 100);
        setTimeout(sendHeight, 500);
        setTimeout(sendHeight, 1500);
      });
    </script>
</body>
</html>
`;

export default function MathRenderer({ content, fullHeight = false }: { content: string, fullHeight?: boolean }) {
  const [height, setHeight] = React.useState(fullHeight ? undefined : 150);

  if (!content) return null;

  return (
    <View style={{ flex: fullHeight ? 1 : 0, height: fullHeight ? undefined : height, width: '100%', overflow: 'hidden' }}>
      <WebView
        originWhitelist={['*']}
        source={{ html: generateHtml(content) }}
        style={{ backgroundColor: 'transparent', flex: 1 }}
        scrollEnabled={fullHeight}
        showsVerticalScrollIndicator={fullHeight}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
            if (fullHeight) return; // Don't need height updates in fullHeight mode
            const h = Number(event.nativeEvent.data);
            if (!isNaN(h) && h > 10) {
                setHeight(h + 30);
            }
        }}
      />
    </View>
  );
}
