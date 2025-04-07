document.addEventListener('DOMContentLoaded', function() {
  // 提交表单前的验证
  const buildingForms = document.querySelectorAll('form[action^="/buildings"]');
  
  buildingForms.forEach(form => {
    form.addEventListener('submit', function(event) {
      const nameInput = form.querySelector('#name');
      const typeSelect = form.querySelector('#type');
      const descriptionInput = form.querySelector('#description');
      
      // 如果是删除表单，不需要验证
      if (form.action.includes('/delete/')) {
        return true;
      }
      
      // 验证名称
      if (!nameInput.value.trim()) {
        event.preventDefault();
        alert('请输入建筑物名称');
        nameInput.focus();
        return false;
      }
      
      // 验证类型
      if (!typeSelect.value) {
        event.preventDefault();
        alert('请选择建筑物类型');
        typeSelect.focus();
        return false;
      }
      
      // 验证描述
      if (!descriptionInput.value.trim()) {
        event.preventDefault();
        alert('请输入建筑物描述');
        descriptionInput.focus();
        return false;
      }
      
      return true;
    });
  });
  
  // 坐标输入辅助
  const positionInputs = document.querySelectorAll('input[name^="position"]');
  
  positionInputs.forEach(input => {
    // 添加步进按钮
    input.addEventListener('wheel', function(event) {
      if (this.matches(':focus')) {
        event.preventDefault();
        const step = parseFloat(this.step) || 1;
        if (event.deltaY < 0) {
          this.value = (parseFloat(this.value) + step).toFixed(1);
        } else {
          this.value = (parseFloat(this.value) - step).toFixed(1);
        }
      }
    });
  });
}); 