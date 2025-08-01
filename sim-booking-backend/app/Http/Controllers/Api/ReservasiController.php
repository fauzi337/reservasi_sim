<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Reservasi;
use App\Models\PanggilAntrian;
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
            ], 422);
        }

        $count = Reservasi::where('jenis_perpanjangan', $validated['jenis_perpanjangan'])
                        ->whereDate('tanggal_reservasi',$todayDate)
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
            ], 422);
        } 

        if ($cekSimLama != "" ) {
            return response()->json([
                'message' => 'Sim Lama Sudah Terdaftar !',
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        } 

        if ($cekNoHp != "" ) {
            return response()->json([
                'message' => 'No HP Sudah Terdaftar !',
                'status' => false,
                'errors' => $validator->errors(),
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

        $data = Reservasi::where('kebutuhan', $request->jenis_antrian)
            ->whereDate('tanggal_reservasi', $todayDate)
            ->where('no_urut', $request->nomor)
            ->select('id')
            ->first();

        $PA = new PanggilAntrian();
        $PA->id = $newid;
        $PA->no_urut = $request->nomor;
        $PA->kdkebutuhan = $request->jenis_antrian;
        $PA->loket = $request->loket;
        $PA->created_at = $today;
        $PA->updated_at = null;
        $PA->statusenabled = true;
        $PA->status = $request->status;
        $PA->reservasi_id = $data->id;
        
        $saved = $PA->save(); // ✅ simpan dan cek hasilnya

        if ($saved) {
            // Jika berhasil, update reservasi
            $updateStReserv = Reservasi::find($data->id);
            if ($updateStReserv) {
                $updateStReserv->status = 'dipanggil';
                $updateStReserv->updated_at = $today;
                $updateStReserv->save();
            }

            return response()->json([
                'status' => true,
                'message' => 'Panggilan Antrian berhasil disimpan dan status reservasi diperbarui!',
            ], 201);
        } else {
            // Jika gagal menyimpan
            return response()->json([
                'status' => false,
                'message' => 'Gagal menyimpan panggilan antrian.',
            ], 500);
        }
    }

    public function getStatusAntrian()
    {
        $today = Carbon::now();
        $todayDate = date('Y-m-d');

        // Ambil total reservasi hari ini yang belum dan sudah dipanggil
        $ppBelum = Reservasi::where('kebutuhan', 'PP')
            ->whereDate('tanggal_reservasi', $todayDate)
            ->where('status', 'Belum')
            ->count();

        $ppSudah = PanggilAntrian::where('kdkebutuhan', 'PP')
            ->whereDate('created_at', $today)
            ->where('status', 'dipanggil')
            ->count();

        $bbBelum = Reservasi::where('kebutuhan', 'BB')
            ->whereDate('tanggal_reservasi', $todayDate)
            ->where('status', 'Belum')
            ->count();

        $bbSudah = PanggilAntrian::where('kdkebutuhan', 'BB')
            ->whereDate('created_at', $today)
            ->where('status', 'dipanggil')
            ->count();

        $dataReservasi = Reservasi::where('statusenabled', true)
            ->whereDate('tanggal_reservasi', $todayDate)
            ->get();

        return response()->json([
            'PP' => ['belum' => $ppBelum, 'sudah' => $ppSudah],
            'BB' => ['belum' => $bbBelum, 'sudah' => $bbSudah],
        ]);
    }
}

