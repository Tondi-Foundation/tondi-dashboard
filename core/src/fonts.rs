use egui::{FontDefinitions, FontFamily};

use egui_phosphor::Variant;
pub fn add_to_fonts(fonts: &mut egui::FontDefinitions, variant: Variant) {
    fonts
        .font_data
        .insert("phosphor".into(), variant.font_data().into());

    if let Some(font_keys) = fonts.families.get_mut(&egui::FontFamily::Proportional) {
        font_keys.push("phosphor".into());
    }

    fonts
        .families
        .entry(egui::FontFamily::Name("phosphor".into()))
        .or_default()
        .insert(0, "phosphor".to_owned());
}

pub fn init_fonts(cc: &eframe::CreationContext<'_>) {
    let mut fonts = FontDefinitions::default();
    
    // 添加基础字体
    add_to_fonts(&mut fonts, egui_phosphor::Variant::Light);
    
    // 添加等宽字体
    fonts
        .families
        .entry(FontFamily::Monospace)
        .or_default()
        .insert(0, "ubuntu_mono".to_owned());

    fonts.font_data.insert(
        "ubuntu_mono".to_owned(),
        std::sync::Arc::new(egui::FontData::from_static(include_bytes!(
            "../resources/fonts/UbuntuMono/UbuntuMono-Regular.ttf"
        ))),
    );

    // 根据平台和运行时环境选择字体加载策略
    #[cfg(target_arch = "wasm32")]
    {
        // Web版本：使用CDN字体，不嵌入大字体文件
        init_web_fonts(&mut fonts);
    }
    
    #[cfg(not(target_arch = "wasm32"))]
    {
        // 原生版本：使用本地字体文件
        init_native_fonts(&mut fonts);
    }

    cc.egui_ctx.set_fonts(fonts);
}

#[cfg(target_arch = "wasm32")]
fn init_web_fonts(_fonts: &mut FontDefinitions) {
    // Web版本只加载必要的字体，大字体通过CSS @font-face加载
    // 这里只添加基础字体，CJK字体通过CSS动态加载
    
    // 注意：Web版本不嵌入任何大字体文件，只使用CDN字体
    // 所有字体通过HTML中的CSS @font-face加载
}

#[cfg(not(target_arch = "wasm32"))]
fn init_native_fonts(fonts: &mut FontDefinitions) {
    use workflow_core::runtime;
    
    // 原生版本加载所有字体
    if runtime::is_native() || runtime::is_chrome_extension() {
        // 只加载必要的字体，按需加载
        fonts.font_data.insert(
            "noto_sans_mono".to_owned(),
            egui::FontData::from_static(include_bytes!(
                "../resources/fonts/NotoSans/NotoSansMono-Light.ttf"
            )).into(),
        );
        fonts.families
            .entry(FontFamily::Proportional)
            .or_default()
            .push("noto_sans_mono".to_owned());
        
        fonts.font_data.insert(
            "ar".to_owned(),
            egui::FontData::from_static(include_bytes!(
                "../resources/fonts/NotoSansArabic/NotoSansArabic-Regular.ttf"
            )).into(),
        );
        fonts.families
            .entry(FontFamily::Proportional)
            .or_default()
            .push("ar".to_owned());
        
        fonts.font_data.insert(
            "he".to_owned(),
            egui::FontData::from_static(include_bytes!(
                "../resources/fonts/NotoSansHebrew/NotoSansHebrew-Regular.ttf"
            )).into(),
        );
        fonts.families
            .entry(FontFamily::Proportional)
            .or_default()
            .push("he".to_owned());
        
        fonts.font_data.insert(
            "devanagari".to_owned(),
            egui::FontData::from_static(include_bytes!(
                "../resources/fonts/NotoSansDevanagari/NotoSansDevanagari-Regular.ttf"
            )).into(),
        );
        fonts.families
            .entry(FontFamily::Proportional)
            .or_default()
            .push("devanagari".to_owned());
        
        // CJK字体按需加载
        fonts.font_data.insert(
            "sc".to_owned(),
            egui::FontData::from_static(include_bytes!(
                "../resources/fonts/NotoSansSC/NotoSansSC-Regular.ttf"
            )).into(),
        );
        fonts.families
            .entry(FontFamily::Proportional)
            .or_default()
            .push("sc".to_owned());
        
        fonts.font_data.insert(
            "tc".to_owned(),
            egui::FontData::from_static(include_bytes!(
                "../resources/fonts/NotoSansTC/NotoSansTC-Regular.ttf"
            )).into(),
        );
        fonts.families
            .entry(FontFamily::Proportional)
            .or_default()
            .push("tc".to_owned());
        
        fonts.font_data.insert(
            "jp".to_owned(),
            egui::FontData::from_static(include_bytes!(
                "../resources/fonts/NotoSansJP/NotoSansJP-Regular.ttf"
            )).into(),
        );
        fonts.families
            .entry(FontFamily::Proportional)
            .or_default()
            .push("jp".to_owned());
        
        fonts.font_data.insert(
            "kr".to_owned(),
            egui::FontData::from_static(include_bytes!(
                "../resources/fonts/NotoSansKR/NotoSansKR-Regular.ttf"
            )).into(),
        );
        fonts.families
            .entry(FontFamily::Proportional)
            .or_default()
            .push("kr".to_owned());
        
        fonts.font_data.insert(
            "hk".to_owned(),
            egui::FontData::from_static(include_bytes!(
                "../resources/fonts/NotoSansHK/NotoSansHK-Regular.ttf"
            )).into(),
        );
        fonts.families
            .entry(FontFamily::Proportional)
            .or_default()
            .push("hk".to_owned());
    }
}

// 动态字体加载功能（可选）
#[cfg(target_arch = "wasm32")]
pub async fn load_font_dynamically(_font_name: &str, _font_url: &str) -> Result<(), String> {
    use wasm_bindgen::prelude::*;
    use wasm_bindgen_futures::JsFuture;
    use web_sys::window;
    
    let window = window().ok_or("Window not available")?;
    let resp_value = JsFuture::from(window.fetch_with_str(_font_url))
        .await
        .map_err(|e| format!("Fetch error: {:?}", e))?;
    let resp: web_sys::Response = resp_value
        .dyn_into()
        .map_err(|e| format!("Response conversion error: {:?}", e))?;
    let array_buffer = JsFuture::from(resp.array_buffer()
        .map_err(|e| format!("Array buffer error: {:?}", e))?)
        .await
        .map_err(|e| format!("Array buffer future error: {:?}", e))?;
    let uint8_array = js_sys::Uint8Array::new(&array_buffer);
    let _font_bytes = uint8_array.to_vec();
    
    // 将字体添加到egui字体定义中
    // 这里需要重新设置字体，因为egui不支持运行时动态添加字体
    // 可以考虑预加载所有需要的字体
    
    Ok(())
}
