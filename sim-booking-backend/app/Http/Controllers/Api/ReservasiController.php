<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\Reservasi;
use App\Models\PanggilAntrian;
use App\Models\Kesehatan;
use Carbon\Carbon;

class ReservasiController extends Controller
{
    public function store(Request $request)
    {
        $newid = Reservasi::max('id')+1;
        $today = carbon::now();
        $todayDate = date('Y-m-d');
        $newid2 = PanggilAntrian::max('id')+1;
        
        $validator = Validator::make($request->all(), [
            'tanggal_reservasi' => 'required|date|after_or_equal:today',
            'nik' => 'required|digits:16',
            'sim_lama' => 'required|max:15',
            'nama_lengkap' => 'required|string',
            'jk' => 'required|in:Laki-laki,Perempuan',
            'tempat_lahir' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'tinggi_badan' => 'required|numeric|min:50|max:250',
            'pekerjaan' => 'required|string',
            'no_hp' => 'required|string|min:10|max:15',
            'alamat' => 'required|string',
            'pendidikan' => 'required|string',
            'fc' => 'required|in:Ada,Tidak Ada',
            'bm' => 'required|in:Ada,Tidak',
            'cf' => 'required|in:Ada,Tidak',
            'sm' => 'required|in:Ada,Tidak Ada',
            'lokasi' => 'required|string',
            'jenis_perpanjangan' => 'required|string',
            'si' => 'required|in:SIM A,SIM B1,SIM B2,SIM C,SIM D',
        ]);
        $validated = $validator->validated();

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Reservasi gagal!',
                'status' => false,
                'errors' => $validator->errors(),
                'as' => '@Kurisu'
            ], 422);
        }

        $count = Reservasi::where('jenis_perpanjangan', $validated['jenis_perpanjangan'])
                        ->whereDate('tanggal_reservasi',$todayDate)
                        ->where('lokasi',$validated['lokasi'])
                        ->count() + 1;

        $cekNik = Reservasi::where('statusenabled', true)
                        ->where('nik', $validated['nik'])
                        ->select('nik')
                        ->first();

        $cekSimLama = Reservasi::where('statusenabled', true)
                        ->where('sim_lama', $validated['sim_lama'])
                        ->select('sim_lama')
                        ->first();

        $cekNoHp = Reservasi::where('statusenabled', true)
                        ->where('no_hp', $validated['no_hp'])
                        ->select('no_hp')
                        ->first();

        $kdKebutuhan = "";
        if ($validated['jenis_perpanjangan'] == 'Perpanjang') {
            $kdKebutuhan = "PP";
        } else {
            $kdKebutuhan = "BB";
        }

        if ($cekNik != "" ) {
            return response()->json([
                'message' => 'Nik Sudah Terdaftar !',
                'status' => false,
                'errors' => $validator->errors(),
                'as' => '@Kurisu'
            ], 422);
        } 

        if ($cekSimLama != "" ) {
            return response()->json([
                'message' => 'Sim Lama Sudah Terdaftar !',
                'status' => false,
                'errors' => $validator->errors(),
                'as' => '@Kurisu'
            ], 422);
        } 

        if ($cekNoHp != "" ) {
            return response()->json([
                'message' => 'No HP Sudah Terdaftar !',
                'status' => false,
                'errors' => $validator->errors(),
                'as' => '@Kurisu'
            ], 422);
        } 

        $reservasi = new Reservasi();
        $reservasi->id = $newid;
        $reservasi->tanggal_reservasi = $validated['tanggal_reservasi'];
        $reservasi->nik = $validated['nik'];
        $reservasi->sim_lama = $validated['sim_lama'];
        $reservasi->nama_lengkap = $validated['nama_lengkap'];
        $reservasi->jenis_kelamin = $validated['jk'];
        $reservasi->tempat_lahir = $validated['tempat_lahir'];
        $reservasi->tanggal_lahir = $validated['tanggal_lahir'];
        $reservasi->tinggi_badan = $validated['tinggi_badan'];
        $reservasi->pekerjaan = $validated['pekerjaan'];
        $reservasi->no_hp = $validated['no_hp'];
        $reservasi->alamat = $validated['alamat'];
        $reservasi->pendidikan = $validated['pendidikan'];
        $reservasi->fotocopy = $validated['fc']; // kalau nama field front-end 'fc'
        $reservasi->kacamata = $validated['bm'];
        $reservasi->cacat = $validated['cf'];
        $reservasi->sertifikat = $validated['sm'];
        $reservasi->lokasi = $validated['lokasi'];
        $reservasi->jenis_perpanjangan = $validated['jenis_perpanjangan'];
        $reservasi->created_at = $today;
        $reservasi->updated_at = null;
        $reservasi->statusenabled = true;
        $reservasi->no_urut = $count;
        $reservasi->kebutuhan = $kdKebutuhan;
        $reservasi->sim = $validated['si'];
        $reservasi->status = 'Belum';
        
        $reservasi->save();

        return response()->json([
            'status' => true,
            'message' => 'Reservasi berhasil disimpan!',
            'as' => '@Kurisu'
        ], 201);
        

        // Simpan data ke database jika kamu sudah punya model
        // Contoh tanpa model dulu:
        // return response()->json([
        //     'status' => true,
        //     'message' => 'Reservasi berhasil disimpan!',
        //     'data' => $validator->validated()
        // ]);
        
        
    }
    
    public function panggilAntrianKesehatan(Request $request)
    {
        $newid = PanggilAntrian::max('id')+1;
        $today = carbon::now();
        $todayDate = date('Y-m-d');
        $kondisi = true;

        $data = Reservasi::where('kebutuhan', $request->jenis_antrian)
            ->whereDate('tanggal_reservasi', $todayDate)
            ->where('no_urut', $request->nomor)
            ->where('lokasi', $request->lokasi)
            ->select('id','nik')
            ->first();

        $antrianVerifikasi = "";
        if ($data == null) {
           $antrianVerifikasi = Kesehatan::whereDate('created_at', $todayDate)
            ->where('no_urut', $request->nomor)
            ->select('reservasi_id')
            ->first();

            $cekStatus = "";
            if ($antrianVerifikasi != null){
                $cekStatus = Reservasi::where('id', $antrianVerifikasi['reservasi_id'])
                ->where('status_barcode', 'Belum')
                ->select('nik')
                ->first();
                $verifikasiBarcode = true;
            }

            if ($cekStatus == null) {
                return response()->json([
                    'status' => false,
                    'message' => 'Gagal menyimpan panggilan antrian.',
                    'as' => '@Kurisu'
                ], 500);
            } else {
                $kondisi = true;
            }
        }

        if ($kondisi == true) {
            $PA = new PanggilAntrian();
            $PA->id = $newid;
            $PA->no_urut = $request->nomor;
            $PA->kdkebutuhan = $request->jenis_antrian;
            $PA->loket = $request->loket;
            $PA->created_at = $today;
            $PA->updated_at = null;
            $PA->statusenabled = true;
            $PA->status = $request->status;
            if ($verifikasiBarcode = true) {
                $PA->reservasi_id = $antrianVerifikasi->reservasi_id;
            } else {
                $PA->reservasi_id = $data->id;
            }
            
            $saved = $PA->save(); // ✅ simpan dan cek hasilnya

            if ($saved) {
                // Jika berhasil, update reservasi
                $updateStReserv = Reservasi::find($verifikasiBarcode = true ? $antrianVerifikasi->reservasi_id : $data->id);
                if ($updateStReserv) {
                    if ($verifikasiBarcode = true) {
                        $updateStReserv->status_barcode = 'dipanggil';
                    } else {
                        $updateStReserv->status = 'dipanggil';
                    }
                    $updateStReserv->updated_at = $today;
                    $updateStReserv->save();
                }

                return response()->json([
                    'status' => true,
                    'message' => 'Panggilan Antrian berhasil disimpan dan status reservasi diperbarui!',
                    'nik' => $verifikasiBarcode = true ? $cekStatus->nik : $data->nik,
                    'as' => '@Kurisu'
                ], 201);
            } else {
                // Jika gagal menyimpan
                return response()->json([
                    'status' => false,
                    'message' => 'Gagal menyimpan panggilan antrian.',
                    'as' => '@Kurisu'
                ], 500);
            }
        }
    }

    public function getStatusAntrian(Request $request)
    {
        $today = Carbon::now();
        $todayDate = date('Y-m-d');

        // Ambil total reservasi hari ini yang belum dan sudah dipanggil
        $ppBelum = Reservasi::where('kebutuhan', 'PP')
            ->whereDate('tanggal_reservasi', $todayDate)
            ->where('status', 'Belum')
            ->where('lokasi', $request->lokasi)
            ->count();

        $ppSudah = PanggilAntrian::from('panggil_antrian_t as pa')
            ->join('reservasis as rev','rev.id','=','pa.reservasi_id')
            ->where('pa.kdkebutuhan', 'PP')
            ->whereDate('pa.created_at', $today)
            ->where('pa.status', 'dipanggil')
            ->where('rev.lokasi', $request->lokasi)
            ->count();

        $bbBelum = Reservasi::where('kebutuhan', 'BB')
            ->whereDate('tanggal_reservasi', $todayDate)
            ->where('status', 'Belum')
            ->where('lokasi', $request->lokasi)
            ->count();

        $bbSudah = PanggilAntrian::from('panggil_antrian_t as pa')
            ->join('reservasis as rev','rev.id','=','pa.reservasi_id')
            ->where('pa.kdkebutuhan', 'BB')
            ->whereDate('pa.created_at', $today)
            ->where('pa.status', 'dipanggil')
            ->where('rev.lokasi', $request->lokasi)
            ->count();

        $vbBelum = Kesehatan::from('kesehatan_t as ks')
            ->join('reservasis as rev', 'rev.id','=','ks.reservasi_id')
            ->whereDate('ks.created_at', $todayDate)
            ->where('rev.status_barcode', 'Belum')
            ->count();

        $vbSudah = PanggilAntrian::from('panggil_antrian_t as pa')
            ->join('reservasis as rev','rev.id','=','pa.reservasi_id')
            ->where('pa.kdkebutuhan', 'VB')
            ->whereDate('pa.created_at', $today)
            ->where('pa.status', 'dipanggil')
            ->where('rev.lokasi', $request->lokasi)
            ->count();

        $dataReservasi = Reservasi::where('statusenabled', true)
            ->whereDate('tanggal_reservasi', $todayDate)
            ->get();

        return response()->json([
            'PP' => ['belum' => $ppBelum, 'sudah' => $ppSudah],
            'BB' => ['belum' => $bbBelum, 'sudah' => $bbSudah],
            'VB' => ['belum' => $vbBelum, 'sudah' => $vbSudah],
        ]);
    }

    public function getStatusJourney(request $request)
    {
        $today = Carbon::now();
        $todayDate = date('Y-m-d');

        $ASIPP = PanggilAntrian::where('statusenabled', true)
            ->whereDate('created_at', $todayDate)
            ->where('status', 'dipanggil')
            ->where('kdkebutuhan', 'PP')
            ->orderBy('created_at', 'desc')
            ->select('no_urut', 'kdkebutuhan')
            ->first();

        $ASIBB = PanggilAntrian::where('statusenabled', true)
            ->whereDate('created_at', $todayDate)
            ->where('status', 'dipanggil')
            ->where('kdkebutuhan', 'BB')
            ->orderBy('created_at', 'desc')
            ->select('no_urut', 'kdkebutuhan')
            ->first();

        return response()->json([
            'saatiniPP' => $ASIPP->kdkebutuhan . '-' . $ASIPP->no_urut,
            'saatiniBB' => $ASIBB->kdkebutuhan . '-' . $ASIBB->no_urut,
            'as' => '@Kurisu'
        ]);
    }

    public function getDataByNik(Request $request)
    {
        $today = Carbon::now();
        $todayDate = date('Y-m-d');
        $estimasiLayanPP = '';
        $estimasiLayanBB = '';
        // \Log::info('Cek NIK dari frontend', [
        //     'nik' => $request->nik,
        //     'request_all' => $request->all(),
        // ]);
        
        try {
            if (!$request->has('nik')) {
                return response()->json([
                    'message' => 'NIK tidak ditemukan dalam request!',
                    'data' => $request->all(),
                    'as' => '@Kurisu'
                ], 400);
            }

            $DSJ = Reservasi::where('statusenabled', true)
                ->where('nik', $request->nik)
                // ->select(DB::raw("CONCAT(REPLACE(TRIM(kebutuhan), ' ', ''), '-', no_urut) AS noantri"))
                ->select('kebutuhan','no_urut','lokasi','tanggal_reservasi','id','nama_lengkap','sim','jenis_perpanjangan','alamat',
                DB::raw("TRIM(status) AS status,TRIM(status_barcode) AS status_barcode,TRIM(status_bayar) AS status_bayar,
                TRIM(status_foto) AS status_foto,TRIM(status_sim) AS status_sim"))
                ->first();

            $ASIPP = PanggilAntrian::from('panggil_antrian_t as pa')
                ->join('reservasis as rev','rev.id','=','pa.reservasi_id')
                ->where('pa.statusenabled', true)
                ->whereDate('pa.created_at', $todayDate)
                ->where('pa.status', 'dipanggil')
                ->where('pa.kdkebutuhan', 'PP')
                ->where('rev.lokasi', $DSJ->lokasi)
                ->orderBy('pa.created_at', 'desc')
                ->select('pa.no_urut', 'pa.kdkebutuhan')
                ->first();

            $ASIBB = PanggilAntrian::from('panggil_antrian_t as pa')
                ->join('reservasis as rev','rev.id','=','pa.reservasi_id')
                ->where('pa.statusenabled', true)
                ->whereDate('pa.created_at', $todayDate)
                ->where('pa.status', 'dipanggil')
                ->where('pa.kdkebutuhan', 'BB')
                ->where('rev.lokasi', $DSJ->lokasi)
                ->orderBy('pa.created_at', 'desc')
                ->select('pa.no_urut', 'pa.kdkebutuhan')
                ->first();

            $jmlASIPP = PanggilAntrian::from('panggil_antrian_t as pa')
                ->join('reservasis as rev','rev.id','=','pa.reservasi_id')
                ->where('pa.statusenabled', true)
                ->whereDate('pa.created_at', $todayDate)
                ->where('pa.status', 'dipanggil')
                ->where('pa.kdkebutuhan', 'PP')
                ->where('rev.lokasi', $DSJ->lokasi)
                ->orderBy('pa.created_at', 'desc')
                ->select('pa.no_urut', 'pa.kdkebutuhan')
                ->count();

            $jmlASIBB = PanggilAntrian::from('panggil_antrian_t as pa')
                ->join('reservasis as rev','rev.id','=','pa.reservasi_id')
                ->where('pa.statusenabled', true)
                ->whereDate('pa.created_at', $todayDate)
                ->where('pa.status', 'dipanggil')
                ->where('pa.kdkebutuhan', 'BB')
                ->where('rev.lokasi', $DSJ->lokasi)
                ->orderBy('pa.created_at', 'desc')
                ->select('pa.no_urut', 'pa.kdkebutuhan')
                ->count();

            if (!$DSJ) {
                return response()->json([
                    'message' => 'Data tidak ditemukan untuk NIK tersebut.',
                ], 404);
            }

            if ($DSJ->no_urut == $jmlASIPP) {
                $estimasiLayanPP = 0;
            } else {
                $estimasiLayanPP = max(0, ($DSJ->no_urut - $jmlASIPP)) * 5;
            }

            if ($DSJ->no_urut == $jmlASIBB) {
                $estimasiLayanBB = 0;
            } else {
                $estimasiLayanBB = max(0, ($DSJ->no_urut - $jmlASIBB)) * 5;
            }

            return response()->json([
                'nomoranda' => $DSJ->kebutuhan . '-' . $DSJ->no_urut,
                'lokasi' => $DSJ->lokasi,
                'saatiniPP' => $ASIPP ? $ASIPP->kdkebutuhan . '-' . $ASIPP->no_urut : null,
                'saatiniBB' => $ASIBB ? $ASIBB->kdkebutuhan . '-' . $ASIBB->no_urut : null,
                'estimasiLayanPP' => $estimasiLayanPP,
                'estimasiLayanBB' => $estimasiLayanBB,
                'data' => $DSJ,
                'status' => [
                    'kesehatan' => $DSJ->status,
                    'verifikasi' => $DSJ->status_barcode,
                    'pembayaran' => $DSJ->status_bayar,
                    'foto' => $DSJ->status_foto,
                    'pengambilan' => $DSJ->status_sim
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan di server.',
                'error' => $e->getMessage(),
                'as' => '@Kurisu'
            ], 500);
        }
    }

    public function saveKesehatan(Request $request)
    {
        $newid = Kesehatan::max('id')+1;
        $today = carbon::now();
        $todayDate = date('Y-m-d');
        $no_antri = Kesehatan::whereDate('created_at',$todayDate)
                            ->count('no_urut')+1;

        $IK = new Kesehatan();
        $IK->id = $newid;
        $IK->tekanan_darah = $request->td;
        $IK->tinggi_badan = $request->tb;
        $IK->berat_badan = $request->bb;
        $IK->suhu = $request->suhu;
        $IK->nadi = $request->nadi;
        $IK->pernafasan = $request->nafas;
        $IK->created_at = $today;
        $IK->updated_at = null;
        $IK->statusenabled = true;
        $IK->reservasi_id = $request->reserv_id;
        $IK->no_urut = $no_antri;
        
        $saved = $IK->save(); // ✅ simpan dan cek hasilnya

        if ($saved) {
            // Jika berhasil, update reservasi
            $updateStReserv = Reservasi::find($request->reserv_id);
            if ($updateStReserv) {
                $updateStReserv->status = 'Sudah';
                $updateStReserv->status_barcode = 'Belum';
                $updateStReserv->updated_at = $today;
                $updateStReserv->save();
            }

            return response()->json([
                'status' => true,
                'message' => 'Input Kesehatan berhasil disimpan dan status reservasi diperbarui!',
                'as' => '@Kurisu'
            ], 201);
        } else {
            // Jika gagal menyimpan
            return response()->json([
                'status' => false,
                'message' => 'Gagal menyimpan Input Kesehatan.',
                'as' => '@Kurisu'
            ], 500);
        }
    }
}

