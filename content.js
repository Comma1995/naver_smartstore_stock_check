(async function () {

  // document 로딩될때까지 기다리기
  function waitForElement(selector) {
    return new Promise(resolve => {
  
      const el = document.querySelector(selector);
      if (el) return resolve(el);
  
      const observer = new MutationObserver(() => {
  
        const el = document.querySelector(selector);
  
        if (el) {
          resolve(el);
          observer.disconnect();
        }
  
      });
  
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
  
    });
  }

  // 재고수량찾기
  function getStock() {
    const script = [...document.querySelectorAll("script")].find(s => s.textContent.includes("stockQuantity"));
    if (!script) return 0;

    const text = script?.textContent ?? "";    
    const matches = text.match(/stockQuantity":\d+/g) || [];
    const numbers = matches.map(v => Number(v.match(/\d+/)[0]));
  
    return numbers.find(v => v !== 0) ?? 0;
  }

  // 화면에 재고수량 표시
  function insertStock(stock) {

    const btn = document.querySelector('button[data-shp-area="pcs.optquantity"]');
    if (!btn) return;
  
    const box = btn.closest("div").closest("div");
    if (!box) return;
  
    if (box.querySelector(".my-stock")) return;
  
    const newDiv = document.createElement("div");

    newDiv.className = "my_stock_div"
    newDiv.style.float = "left";
    newDiv.style.position = "relative";

    newDiv.style.height = "34px";
    newDiv.style.border = "solid 1px #dde0e3";
    newDiv.style.padding = "0 8px";

    newDiv.style.display = "flex";
    newDiv.style.alignItems = "center";
    newDiv.style.justifyContent = "center";

    const newSpan = document.createElement("span");
  
    newSpan.className = "my-stock";
    if (stock == -1){
      newSpan.textContent = "새로고침필요";
    }
    else{
      newSpan.textContent = `재고수량 ${stock}`;
    }

    if (stock <= 5 && stock != 0) {
      newSpan.style.color = "#ff3b3b";
    }
    else if (stock <= 10 && stock != 0) {
      newSpan.style.color = "#ff8c00";
    }
    else {
      newSpan.style.color = "#000000";
    }
  
    newSpan.style.fontSize = "13px";
    newSpan.style.fontWeight = "600";
    newSpan.style.whiteSpace = "nowrap";
    newSpan.style.margin = "auto";
    
    box.parentElement.appendChild(newDiv);
    newDiv.appendChild(newSpan);
  }

  try {
    // Document 로딩 기다리기기
    const btn = await waitForElement('button[data-shp-area="pcs.optquantity"]');

    // 재고수량 찾기
    const stock = getStock();

    // 페이지 로딩이 덜 됐을때 네이버가 기본으로 막 집어넣는 값 검출 <- 새로고침 필요
    if (stock == 1000){
      insertStock(-1);
    }
    else{
      insertStock(stock);
    }
    
  } catch (err) {
    console.log("재고확인 오류", err);
  }

})();
