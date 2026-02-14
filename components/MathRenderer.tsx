
import React from 'react';
import { WebView } from 'react-native-webview';
import { Text, View } from 'react-native';

const generateHtml = (content: string) => {
  console.log('MathRenderer - Generating HTML for content:', content?.substring(0, 100));
  
  // Escape content for textarea
  const escapedContent = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta charset="UTF-8">
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
        img { max-width: 100%; height: auto; }
        strong { font-weight: 700; color: #111827; }
        em { font-style: italic; }
        .MathJax { font-size: 1.1em !important; }
    </style>
    
    <!-- MathJax Configuration -->
    <script>
      window.MathJax = {
        tex: {
          inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
          displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
          processEscapes: true,
          processEnvironments: true
        },
        options: {
          skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
        },
        startup: {
          pageReady: () => {
            return MathJax.startup.defaultPageReady().then(() => {
              sendHeight();
            });
          }
        }
      };
    </script>
    
    <!-- MathJax Library -->
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" async></script>
</head>
<body>
    <textarea id="content" style="display:none;">${escapedContent}</textarea>
    <div id="render-target"></div>

    <script>
      function sendHeight() {
          var height = document.body.scrollHeight;
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(String(height));
          }
      }

      document.addEventListener("DOMContentLoaded", function() {
        try {
          const rawContent = document.getElementById('content').value;
          
          // Process markdown
          let html = rawContent;
          
          // Bold: **text**
          html = html.replace(/\\*{2}([^*]+)\\*{2}/g, '<strong>$1</strong>');
          
          // Italic: *text*
          html = html.replace(/\\*([^*]+)\\*/g, '<em>$1</em>');
          
          // Line breaks
          html = html.replace(/\\n/g, '<br>');

          const target = document.getElementById('render-target');
          target.innerHTML = html;

          // MathJax will automatically process the content
          // Send height updates
          setTimeout(sendHeight, 500);
          setTimeout(sendHeight, 1000);
          setTimeout(sendHeight, 2000);
        } catch (error) {
          document.getElementById('render-target').innerHTML = '<p style="color: red;">Error: ' + error.message + '</p>';
        }
      });
    </script>
</body>
</html>
`;
};

export default function MathRenderer({ content, fullHeight = false }: { content: string, fullHeight?: boolean }) {
  const [height, setHeight] = React.useState(fullHeight ? undefined : 150);

  console.log('MathRenderer component called with content:', content?.substring(0, 50), 'fullHeight:', fullHeight);

  if (!content) {
    console.log('MathRenderer: No content provided, returning null');
    return null;
  }

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
